
//type setting ###

/*
	sorted by personal rating of prioritiy of implementation:

	mathlist
	nucleus, subscript, superscript
	delimiter (( { [ )
	roots

	integrals, summation, limits	
	binomials 
	matrix
	cramped style
	ellipsis
	accents (dot, hat, ...)
	manual spaces
	text
*/

/*
	font-styles: 
	D (display-style, meaning no line breaks and taking up more space)
	T (text-style, with linebreaks, scripts are placed to take up less space)
	S (script-style, subscript, superscript, fractions, ...)
	SS (script-script-style, scripts of scripts, ...)

	for each of these styles there is also a "cramped" version denoted 
	by a prime, for example S' standing for cramped-script-style. 
	they are used when placed under something else, for example the denominator 
	or a subscript. superscripts are less raised in cramped styles.

	parameters: 
	MathUnit (1/18 em)
	RuleThickness (thickness of the fraction stroke, underlines, overlines)
	AxisHeight (vertical distance from the baseline to the layout axis. 
		letters are placed directly on the baseline while for examples fractions are aligned along the axis)


	abstract-formula-description ###
		
		types used in texbook: "ord", "op", "bin", "rel", "open", "close", "punct", "inner"

		types ##
			- ord
				- number
				- letter (not only alphabetical)	
			- op (big operator, like sigma or integral)
			- bin (binary operator)
			- rel (relation operator)
			- open (may not be drawn by character but by other graphics)
			- close
			- punct
			- inner
				- mathlist
				- fraction
				- root
				- script
			- spacing


	abstract-layout-description ###	

		types ##
			- mathlist { items }
			- script { nucleus, sub, sup }
			- fraction { numerator, fractionRule, denominator }
			- delimited { leftDelim, rightDelim, inner }
			- root { index, radicand, radical }
			- single


		every layout node has these properties: {
			type, style,
			dimensions: { width, yMax, yMin }, 
			position: [x, y]
		}
		the vertical axis of this system points up

		style: {
			type: D | T | S | SS,
			cramped: bool,
			baseFontSize: number
		}
		font-size and axis-height can be infered from style.




	input-data-structure:

	example: 1 + 3 * a - b = 35
	horizontal-list: {
		type: "mathlist",
		items: [
			{ type: "ord", value: "one" },
			{ type: "bin", value: "plus" },
			{ type: "num", value: "three" },
			{ type: "bin", value: "dotmath" },
			{ type: "ord", value: "a" },
			{ type: "bin", value: "minus" },
			{ type: "ord", value: "b" },
			{ type: "rel", value: "equal" },
			{ type: "ord", value: "three" },
			{ type: "ord", value: "five" }
		]
	}
*/

import * as R from 'ramda';
import { 
	getGlyphByName, getCharByName, getGlyphIndexByName, loadFontsAsync, pathContours, translateContours, scaleContours
} from './opentype-util.js';
import { addFontFaces, pickList, accumSum, sum } from './util.js';

const clamp = (min, max, val) => {
	if (val < min) return min;
	if (val > max) return max;
	return val;
};
const isDefined = obj => obj !== undefined;

const emToPx = (style, em) => style.fontSize * em / 1000;

const scaleMap = scale => (num => num * scale);

//formula description ###

const formulaNodeTypes = [
	"ord", "op", "bin", "rel", "open", "close",
	"punct", "inner", "spacing"
];
const innerTypes = ["mathlist", "fraction", "root", "script"];
const getIndexOfFormulaNodeType = (nodeType) => {
	if (innerTypes.includes(nodeType)) nodeType = "inner";
	return formulaNodeTypes.indexOf(nodeType);
};
const isFormulaNodeGlyph = node => [0, 1, 2, 3, 4, 5, 6].includes(getIndexOfFormulaNodeType(node.type));
const isFormulaNodeInner = node => innerTypes.includes(node.type);
const isNodeNumeric = (nodeType, nodeValue) => nodeType === "ord" && ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"].includes(nodeValue);

//style ###
import fontMetrics from './fontMetricsData.js';
import { createDelimiter } from './delimiter-util.js';
import { createRoot } from './root-util.js';
const getGlyphMetrics = (node) => {
	const fontName = formulaNodeIndexToFontName[getIndexOfFormulaNodeType(node.type)].replace("KaTeX_", "");
	const entry = fontMetrics[`${fontName}-Regular`];
	const font = lookupFont(node.type, node.value);
	const glyph = getGlyphByName(font, node.value);
	const metrics = entry[glyph.unicode];
	return {
		depth: metrics[0], 
		height: metrics[1],
		italicCorrection: metrics[2],
		skew: metrics[3],
		width: metrics[4]
	};
}
const getItalicCorrection = (style, node) => {
	const entry = fontMetrics["Main-Italic"];
	const font = lookupFont(node.type, node.value);
	const key = `${getGlyphIndexByName(font, node.value)}`;
	return entry[key] ? entry[key][2] : 0;
};
let opentypeFonts = {};
const katexFontNames = {
	Main: "KaTeX_Main", Math: "KaTeX_Math"
};
const fontNamesBySize = [
	"KaTeX_Math", 
	"KaTeX_Size1",
	"KaTeX_Size2",
	"KaTeX_Size3",
	"KaTeX_Size4"
];

//example: how much bigger is a glyph in "KaTeX_Size3" compared to "KaTeX_Math"
const getFontTierSize = (fontName) => {
	const index = fontNamesBySize.indexOf(fontName);
	if (index < 0){
		return -1;
	}
	return sizeFontScales[index];
};


const formulaNodeIndexToFontName = [
	katexFontNames.Math,
	"KaTeX_Size2",
	katexFontNames.Main, katexFontNames.Main, katexFontNames.Main, katexFontNames.Main, katexFontNames.Main,
	"",
	""
];
const lookupFontName = (nodeType, glyphName) => {
	if (isNodeNumeric(nodeType, glyphName)) {
		return katexFontNames.Main;
	}
	return formulaNodeIndexToFontName[getIndexOfFormulaNodeType(nodeType)];
};
const lookupFont = (nodeType, glyphName) => opentypeFonts[lookupFontName(nodeType, glyphName)];
const getDimensionsOfCharNode = (style, node) => {
	const font = lookupFont(node.type, node.value);
	const glyph = getGlyphByName(font, node.value);
	const scaleNum = num => emToPx(style, num);
	return R.map(scaleNum)({
		width: glyph.advanceWidth,
		yMin: glyph.yMin,
		yMax: glyph.yMax
	});
};
const getRightBoundOfCharNode = (style, node) => {
	const font = lookupFont(node.type, node.value);
	const glyph = getGlyphByName(font, node.value);
	return emToPx(style, glyph.xMax);
};

const styleTypes = ["D", "T", "S", "SS"];
const styleTypeToFontScale = [1, 1, 0.7, 0.5];
const styleTypeToIndex = type => styleTypes.indexOf(type);
const getRelativeStyleType = (styleType, stride) => styleTypes[clamp(0, styleTypes.length - 1, styleTypeToIndex(styleType) + stride)];
const getSmallerStyleType = styleType => ["D", "T"].includes(styleType) ? "S" : "SS";
const getFontSizeOfStyleType = (defaultFontSize, styleType) => defaultFontSize * styleTypeToFontScale[styleTypeToIndex(styleType)];
const getSmallerStyle = (style) => {
	const nextStyleType = getSmallerStyleType(style.type);
	return switchStyleType(style, nextStyleType);
};
const switchStyleType = (style, nextStyleType) => {
	return {
		...style,
		type: nextStyleType,
		fontSize: getFontSizeOfStyleType(style.baseFontSize, nextStyleType)
	};
};
const incrementStyleType = (style) => switchStyleType(style, getRelativeStyleType(style.type, 1));



//layout ###
const getTotalHeightOfDimensions = dimensions => dimensions.yMax - dimensions.yMin;
const createDimensions = (width, yMin, yMax) => {
	return { width, yMin, yMax }
};
const getBoundingDimensions = objs => {
	return {
		width: Math.max(...objs.map(obj => obj.position[0] + obj.dimensions.width)),
		yMin: Math.min(...objs.map(obj => obj.position[1] + obj.dimensions.yMin)),
		yMax: Math.max(...objs.map(obj => obj.position[1] + obj.dimensions.yMax)),
	}
};
const offsetDimensionsVertically = (dimensions, offset) => {
	return {
		...dimensions,
		yMin: dimensions.yMin + offset,
		yMax: dimensions.yMax + offset
	}
};
const toEmSpace = (fontSize) => 1000 / fontSize;
const fromEmSpace = (fontSize) => fontSize / 1000;

const dimensionsToEmSpace = (dimensions, fontSize) => R.map(scaleMap(1000 / fontSize), dimensions);
const dimensionsFromEmSpace = (dimensions, fontSize) => R.map(val => val * fontSize / 1000, dimensions);
const scaleMetrics = (metrics, scale) => R.map(val => val * scale, metrics);

const withPosition = (layoutNode, position) => R.assoc("position", position, layoutNode);
const calcCentering = (size, availableSize) => (availableSize - size) / 2;
const getRuleThickness = style => style.fontSize * 0.05;
const getAxisHeight = style => (style.fontSize * 250) / 1000;
const nodeSpacingTable = [
	[0, 1, 2, 3, 2, 0, 0, 1],
	[1, 1, 0, 3, 0, 0, 0, 1],
	[2, 2, 0, 0, 2, 0, 0, 2],
	[3, 3, 0, 0, 3, 0, 0, 3],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 3, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 1, 1],
	[1, 1, 2, 3, 1, 0, 1, 1]
];
const getHorizontalSpacingBetweenNodes = (typeA, typeB) => {
	const [ind1, ind2] = [typeA, typeB].map(getIndexOfFormulaNodeType);
	if (ind1 < 0 || ind2 < 0) {
		return 0;
	}
	return 2 * nodeSpacingTable[ind1][ind2] / 18;
};
const isNodeOfAnyType = (node, types) => types.includes(node.type);
const isNodeAlignedToBaseline = (node) => isNodeOfAnyType(node, ["mathlist", "script"]) || isFormulaNodeGlyph(node);
const isNodeAlignedToAxis = (node) => isNodeOfAnyType(node, ["fraction", "root"]);
const getAxisAlignment = (style, node) => isNodeAlignedToAxis(node) ? getAxisHeight(style) : 0;
const getHeightAndDepthFromAxis = (node, dim, axisHeight) => {
	return isNodeAlignedToBaseline(node) ? [ dim.yMax - axisHeight, dim.yMin - axisHeight ] : [dim.yMax, dim.yMin];
};
const getChildNodes = node => {
	if (node.type === "mathlist"){
		return node.items;
	}
	else if (node.type === "script"){
		return [node.nucleus, node.sup, node.sub];
	}
	else if (node.type === "fraction"){
		return [node.numerator, node.denominator];
	}
	return [];
};



const layoutMathList = (style, mathList) => {
	const items = mathList.items;
	const layoutItems = items.map((item, ind) => layoutNode(style, item));
	const axisHeight = getAxisHeight(style);

	let curX = 0;
	const positions = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const layoutItem = layoutItems[i];
		const y = getAxisAlignment(style, item);

		positions.push([curX, y]);
		curX += layoutItem.dimensions.width;
		
		//spacing
		if (i < items.length - 1) {
			curX += getHorizontalSpacingBetweenNodes(items[i].type, items[i + 1].type) * style.fontSize;
		}
	}

	const positionedItems = layoutItems.map((layoutItem, index) => {
		return { ...layoutItem, position: positions[index] }
	});

	return {
		type: "mathlist",
		dimensions: getBoundingDimensions(positionedItems),
		items: positionedItems
	};
};

const layoutFraction = (style, fraction) => {
	const subStyle = incrementStyleType(style);
	const [num, denom] = [fraction.numerator, fraction.denominator].map(layoutWithStyle(subStyle));
	const width = Math.max(...[num, denom].map(n => n.dimensions.width));
	
	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const topSpacing = ruleThickness * 6;
	const bottomSpacing = ruleThickness * 6;

	const yMax = halfRuleThickness + topSpacing + getTotalHeightOfDimensions(num.dimensions);
	const yMin = -(halfRuleThickness + bottomSpacing + getTotalHeightOfDimensions(denom.dimensions));

	const numY = halfRuleThickness + topSpacing - num.dimensions.yMin;
	const denomY = -(halfRuleThickness + bottomSpacing + denom.dimensions.yMax);
	const middleXs = [num, denom].map(n => calcCentering(n.dimensions.width, width));
	const numPos = [middleXs[0], numY];
	const denomPos = [middleXs[1], denomY];

	return {
		type: "fraction", style,
		numerator: withPosition(num, numPos),
		denominator: withPosition(denom, denomPos),
		ruleThickness,
		dimensions: createDimensions(width, yMin, yMax)
	};
};


//script ###

const getRightBoundOfNode = (formNode, layNode) => {
	if (isFormulaNodeGlyph(formNode)){
		return getRightBoundOfCharNode(layNode.style, formNode);
	}
	return layNode.dimensions.width;
};
const getSubOrSupStyle = (scriptStyle, subOrSupNode) => {
	return subOrSupNode.type === "fraction" ? getSmallerStyle(getSmallerStyle(scriptStyle)) : getSmallerStyle(scriptStyle);
};
const getSupSubTargetYNoLimits = (style, script, nucleusDim) => {
	const { nucleus } = script;
	const nucleusType = nucleus.type;
	const isNucleusBigOp = nucleus.type === "op";
	const isNucleusGlyph = isFormulaNodeGlyph(nucleus);
	const { fontSize } = style;
	if (isNucleusGlyph && !isNucleusBigOp){
		return [
			fontSize * 0.42,
			fontSize * -0.2
		]
	}
	else {
		return [
			nucleusDim.yMax, 
			nucleusDim.yMin - fontSize * 0.06
		]
	}
};
const layoutScript = (style, script, layoutOptions={}) => {
	/*
		supscript: 
		there is a style-dependent target-height, if the superscript is a char, 
		simply raise it to that height. if it's not a char, try to raise it to that height,
		but there has to be a gap between the bottom of the supscript and the baseline of the nucleus.
	*/

	layoutOptions = {
		limitPositions: false,
		...layoutOptions
	};

	const { nucleus, sup, sub } = script;
	const nucleusLayouted = withPosition(layoutNode(style, nucleus), [0, 0]);
	const isNucleusGlyph = isFormulaNodeGlyph(nucleus);
	const fontSize = style.fontSize;

	const scriptLayouted = {
		nucleus: nucleusLayouted
	};

	const nucleusRight = getRightBoundOfNode(nucleus, nucleusLayouted);
	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	if (sup){
		const supStyle = getSubOrSupStyle(style, sup);
		const supLayouted = layoutNode(supStyle, sup);
		const targetY = (function(){
			let y = supSubTargetY[0] - getAxisAlignment(style, sup);
			
			//if bottom of superscript is too close to baseline, shift it up
			const minBottomToBaselineGap = fontSize * 0.3;
			const bottomToSupBaseline = (y + supLayouted.dimensions.yMin);
			y += Math.max(0, -(bottomToSupBaseline - minBottomToBaselineGap));
			return y;
		})();
		//add a small spacing
		const supX = nucleusRight + (fontSize * 0.08);
		supLayouted.position = [supX, targetY];
		scriptLayouted.sup = supLayouted;
	}

	if (sub){
		const subStyle = getSubOrSupStyle(style, sub);
		const subLayouted = layoutNode(subStyle, sub);
		const targetY = (function(){
			let y = supSubTargetY[1];

			if(sup) y -= fontSize * 0.08;

			//if top of subscript is too close to the axis, shift it down
			const nucleusAxisY = getAxisHeight(style);
			const minTopToAxisGap = -fontSize * 0.1;
			const topToAxisGap = nucleusAxisY - (y + subLayouted.dimensions.yMax);
			y += Math.min(0, topToAxisGap - minTopToAxisGap);

			return y;
		})();

		const subX = isNucleusGlyph ? (function(){
			const metrics = getGlyphMetrics(nucleus);
			return fontSize * (metrics.width);
		})() : nucleusRight; 
		subLayouted.position = [subX, targetY];
		scriptLayouted.sub = subLayouted;
	}

	const dimensions = getBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script",
		...scriptLayouted, style, dimensions
	};
};


const layoutDelimiter = (style, delim) => {
	//from em space
	const fontSize = style.fontSize * (delim.sizeRatio ||1);
	const dimensions = R.map(val => val * fontSize  / 1000, delim.metrics);
	if (delim.type === "char"){
		return {
			type: "char", char: delim.char, dimensions,
			yOffset: (1 - delim.sizeRatio) * getAxisHeight(style),
			style: { 
				...style, 
				fontSize, 
				fontName: delim.fontName
			}
		}
	}
	else {
		return { type: "contours", contours: delim.contours, dimensions, style } 
	}
};
const layoutDelimited = (style, delimNode) => {
	const { delimited } = delimNode;
	const delimitedLayouted = layoutNode(style, delimited);
	const delimDim = delimitedLayouted.dimensions;
	const axisHeight = getAxisHeight(style);

	//to em space
	const axisOffset = isNodeAlignedToBaseline(delimited) ? -axisHeight : 0;
	const [height, depth] = [delimDim.yMax, delimDim.yMin]
		.map(val => val + axisOffset)
		.map(val => val * 1000 / style.fontSize);

	const [leftDelim, rightDelim] = ["leftDelim", "rightDelim"]
		.map(delimProp => createDelimiter(opentypeFonts, delimNode[delimProp].value, height, depth, style.fontSize * 4))
		.map(delim => layoutDelimiter(style, delim));
	const delimYs = [leftDelim, rightDelim].map(delim => delim.yOffset || 0);
	const itemXs = accumSum([
		leftDelim.dimensions.width + getHorizontalSpacingBetweenNodes("open", delimited.type), 
		delimitedLayouted.dimensions.width + getHorizontalSpacingBetweenNodes(delimited.type, "close")
	]);	

	const items = [
		withPosition(leftDelim, [itemXs[0], delimYs[0]]),
		withPosition(delimitedLayouted, [
			itemXs[1], 
			getAxisAlignment(style, delimited)
		]),
		withPosition(rightDelim, [itemXs[2], delimYs[1]])
	];
	return {
		type: "mathlist", 
		dimensions: getBoundingDimensions(items),
		style, items
	};
};


const layoutRoot = (style, root) => {
	const radicandLayouted = layoutNode(style, root.radicand);
	
	const radicamDimEm = dimensionsToEmSpace(radicandLayouted.dimensions, style.fontSize);
	const [radicandWidth, radicandHeight] = [
		radicamDimEm.width, 
		getTotalHeightOfDimensions(radicamDimEm)
	];

	const genRoot = createRoot(opentypeFonts, radicandWidth, radicandHeight, style.fontSize * 2);
	const fromEm = fromEmSpace(style.fontSize);

	const rootMetrics = dimensionsFromEmSpace(genRoot.metrics, style.fontSize);
	const rootHeight = getTotalHeightOfDimensions(rootMetrics);
	const contoursOffset = [
		0, radicandLayouted.dimensions.yMax - rootMetrics.yMax + (rootHeight - getTotalHeightOfDimensions(radicandLayouted.dimensions)) / 2
	];
	const rootContours = genRoot.contours;// translateContours(genRoot.contours);

	const radicandPosition = [fromEm * genRoot.innerStartX, 0];
	Object.assign(radicandLayouted, { position: radicandPosition });

	const radicalLayouted = {
		type: "contours", style,
		contours: rootContours,
		position: contoursOffset,
		dimensions: rootMetrics
	};


	//index
	const indexLayouted = root.index ? (function(){
		const indexStyle = switchStyleType(style, "SS");
		const indexLayouted = layoutNode(indexStyle, root.index);
		const scaledCorner = genRoot.indexCorner.map(scaleMap(fromEm));
		const rightBottomPosition = [
			contoursOffset[0] + scaledCorner[0],
			contoursOffset[1] + scaledCorner[1]
		];
		const indexPosition = [
			rightBottomPosition[0] - indexLayouted.dimensions.width,
			rightBottomPosition[1] - indexLayouted.dimensions.yMin
		];
		return withPosition(indexLayouted, indexPosition);
	})() : undefined;

	const dimensions = getBoundingDimensions([radicalLayouted, indexLayouted].filter(isDefined));

	return {
		type: "root", dimensions,
		radical: radicalLayouted,
		radicand: radicandLayouted,
		...(indexLayouted ? { index: indexLayouted } : {})
	}
};

const layoutVertically = (style, nodes, layoutOptions={}) => {
	layoutOptions = {
		spacing: style.fontSize * 0.5,
		...layoutOptions
	};


};

const nodeLayoutFuncMap = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot
};
const layoutCharNode = (style, node) => {
	const fontName = lookupFontName(node.type, node.value);
	const font = opentypeFonts[fontName];
	return {
		type: "char",
		char: getCharByName(font, node.value),
		style: { ...style, fontName },
		dimensions: getDimensionsOfCharNode(style, node)
	};
};
const layoutNode = (style, node) => {
	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type](style, node);
	}
	if (isFormulaNodeGlyph(node)){
		return layoutCharNode(style, node);
	}
};
const layoutWithStyle = (style) => (node => layoutNode(style, node));


//rendering ###

const renderAxisLine = (ctx, node) => {
	ctx.save();
	ctx.beginPath();
	const axisHeight = getAxisHeight(node.style);
	ctx.translate(0, axisHeight);
	ctx.moveTo(0, 0);
	ctx.lineTo(node.width, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	Object.assign(ctx, { lineWidth: 1, strokeStyle: "red" });
	ctx.stroke();
	ctx.restore();
};
const renderBoundingBox = (ctx, node) => {
	ctx.save();
	const dim = node.dimensions;
	const height = dim.yMax - dim.yMin;
	ctx.beginPath();
	ctx.rect(0, -dim.yMax, dim.width, height);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.restore();
};
const renderFormula = (canvas, ctx, renderData) => {
	const color = "black";
	ctx.fillStyle = color;
	ctx.strokeStyle = color;

	const renderPropNodes = (node, props) => pickList(props, node).filter(isDefined).forEach(renderNode);

	const renderNode = node => {
		
		ctx.save();
		ctx.translate(node.position[0], -node.position[1]);

		//renderBoundingBox(ctx, node);

		const nodeType = node.type;
		if (nodeType === "char"){
			const style = node.style;
			ctx.font = `${style.fontSize}px ${style.fontName}`;
			ctx.fillText(node.char, 0, 0);
		}
		else if (nodeType === "contours"){
			ctx.save();
			ctx.scale(...[0, 1].map(n => (node.style.fontSize / 1000)));
			ctx.scale(1, -1);
			pathContours(ctx, node.contours);
			ctx.restore();
			ctx.fillStyle = "black";
			ctx.fill();
		}
		else if (nodeType === "mathlist"){
			node.items.forEach(renderNode);
		}
		else if (nodeType === "fraction"){
			pickList(["numerator", "denominator"], node).forEach(renderNode);

			//draw fraction line
			{
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(node.dimensions.width, 0);
				ctx.lineWidth = node.ruleThickness;
				ctx.stroke();
			}
		}
		else if (nodeType === "script"){
			pickList(["nucleus", "sup", "sub"], node).filter(isDefined).forEach(renderNode);
		}
		else if (nodeType === "root"){
			renderPropNodes(node, ["radical", "radicand", "index"]);
		}
		
		ctx.restore();
	};
	renderData.position = [
		calcCentering(renderData.dimensions.width, canvas.width),
		-calcCentering(getTotalHeightOfDimensions(renderData.dimensions), canvas.height)
	];
	renderNode(renderData);
};

const loadFonts = async () => {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const fontEntries = [
		["KaTeX_Main", "KaTeX_Main-Regular.ttf"],
		["KaTeX_Math", "KaTeX_Math-Italic.ttf"],
		["KaTeX_Size1", "KaTeX_Size1-Regular.ttf"],
		["KaTeX_Size2", "KaTeX_Size2-Regular.ttf"],
		["KaTeX_Size3", "KaTeX_Size3-Regular.ttf"],
		["KaTeX_Size4", "KaTeX_Size4-Regular.ttf"]
	];
	const fontUrlMap = R.fromPairs(fontEntries.map(entry => [entry[0], baseUrl + entry[1]]));
	const fontMap = await loadFontsAsync(fontUrlMap);
	await addFontFaces(fontUrlMap);
	return fontMap;
};


async function main(){

	//font loading ###
	const fontData = await loadFonts();
	opentypeFonts = fontData;
	window.opentypeFonts = opentypeFonts;



	let formulaData = {
		root: {
			type: "mathlist", 
			items: [
				{
					type: "root",
					radicand: {
						type: "fraction",
						numerator: { type: "ord", value: "one" },
						denominator: { type: "ord", value: "pi" }
					},
					index: { 
						type: "delimited", 
						leftDelim: { type: "open", value: "parenleft" },
						rightDelim: { type: "open", value: "parenright" },
						delimited: {
							type: "fraction",
							numerator: { type: "ord", value: "seven" },
							denominator: { type: "ord", value: "delta" }
						}
					}
				},
				{ type: "bin", value: "plus" },
				{ type: "ord", value: "alpha" }
			]
		}
	};
	formulaData = {
		root: {
			type: "mathlist", 
			items: [
				{ type: "ord", value: "one" },
				{ 
					type: "delimited", 
					leftDelim: { type: "open", value: "parenleft" },
					rightDelim: { type: "close", value: "parenright" },
					delimited: { type: "ord", value: "omega" }
				},
				{ type: "ord", value: "two" },
			]
		}
	};
	formulaData = {
		root: {
			type: "script", 
			nucleus: {
				type: "op", value: "integral"
			},
			sup: {
				type: "mathlist",
				items: [
					{ type: "bin", value: "plus" },
					{ type: "ord", value: "x" }
				]
			},
			sub: {
				type: "mathlist",
				items: [
					{ type: "bin", value: "minus" },
					{ type: "ord", value: "x" }
				]
			}
		}
	};



	
	const layoutData = layoutNode({
		type: "D", 
		baseFontSize: 30,
		fontSize: 30
	}, formulaData.root);
	
	document.body.insertAdjacentHTML("beforeend", `
		<canvas width=800 height=400></canvas>
	`);
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	renderFormula(canvas, ctx, layoutData);
}

main();
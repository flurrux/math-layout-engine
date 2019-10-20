import { scaleMap, identity, addFontFaces } from "./util";
import { nodeType, isNodeComposite, glyphTypes } from "./node-types";
import * as R from 'ramda';
import { layoutScript } from "./script-layout";
import { getMetrics, lookUpGlyphByCharOrAlias, getDefaultEmphasis } from "./font-data/katex-font-util";


//layout util ###

const calcCentering = (size, availableSize) => (availableSize - size) / 2;

const dimensionHeight = dimensions => dimensions.yMax - dimensions.yMin;

const boxRight = boxNode => boxNode.position[0] + boxNode.dimensions.width;
const boxTop = boxNode => obj.position[1] + boxNode.dimensions.yMax;
const boxBottom = boxNode => obj.position[1] + boxNode.dimensions.yMin;

const calcBoundingDimensions = objs => identity({
	width: Math.max(...objs.map(boxRight)),
	yMin: Math.min(...objs.map(boxBottom)),
	yMax: Math.max(...objs.map(boxTop)),
});

const offsetDimensionsVertically = (dimensions, offset) => identity({
	...dimensions,
	yMin: dimensions.yMin + offset,
	yMax: dimensions.yMax + offset
})


const toEmSpace = (fontSize) => 1000 / fontSize;
const fromEmSpace = (fontSize) => fontSize / 1000;

const dimensionsToEmSpace = (dimensions, fontSize) => R.map(scaleMap(1000 / fontSize), dimensions);
const dimensionsFromEmSpace = (dimensions, fontSize) => R.map(scaleMap(fontSize / 1000), dimensions);

const scaleMetrics = (metrics, scale) => R.map(scaleMap(scale), metrics);

const withPosition = (layoutNode, position) => R.assoc("position", position, layoutNode);


const isNodeOfAnyType = (node, types) => types.includes(node.type);

//axisHeight means the vertical position of the axis relative to the baseline. 
//this value is fixed and only scales with the font-size.
const normalizedAxisHeight = 0.25;
const getAxisHeight = style => style.fontSize * normalizedAxisHeight;

//the horizontal spacing between two nodes depends on their respective types
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
const getIndexOfFormulaNodeType = type => isNodeComposite(node) ? 7 : glyphTypes.indexOf(type);
const getHorizontalSpacingBetweenNodes = (typeA, typeB) => {
	const [ind1, ind2] = [typeA, typeB].map(getIndexOfFormulaNodeType);
	if (ind1 < 0 || ind2 < 0) {
		return 0;
	}
	return 2 * nodeSpacingTable[ind1][ind2] / 18;
};




const isNodeAlignedToBaseline = (node) => isNodeOfAnyType(node, ["mathlist", "script"]) ||
	isFormulaNodeGlyph(node) || (node.type === "root" && isNodeAlignedToBaseline(node.radicand));

const isNodeAlignedToAxis = (node) => isNodeOfAnyType(node, ["fraction"]) ||
	(node.type === "root" && isNodeAlignedToAxis(node.radicand));

//if a node is aligned to the axis rather than the baseline, this function will get the vertical offset
const getAxisAlignment = (style, node) => isNodeAlignedToAxis(node) ? getAxisHeight(style) : 0;

const getHeightAndDepthFromAxis = (node, dim, axisHeight) => {
	return isNodeAlignedToBaseline(node) ? [dim.yMax - axisHeight, dim.yMin - axisHeight] : [dim.yMax, dim.yMin];
};



//pre-processing ###

const getSubNodePaths = node => {
	if (node.type === nodeType.mathlist) {
		return R.map(index => ["items", index], R.range(0, node.items.length));
	}
	else if (node.type === nodeType.script) {
		return [["nucleus"], ["sup"], ["sub"]];
	}
	else if (node.type === nodeType.fraction) {
		return [["numerator"], ["denominator"]];
	}
	else if (node.type === nodeType.root) {
		return [["index"], ["radical"], ["radicand"]];
	}
	else if (node.type === nodeType.delimited){
		return [["leftDelim"], ["delimited"], ["rightDelim"]];
	}
	return [];
};
// const mapFormulaTree = (mapFunc, formulaNode) => {};
// const insertCharCode = node => isNodeChar(node) ? { ...node, unicode:  } : node;
// const insertCharCodes = parent => mapFormulaTree(insertCharCode, parent);



//layout ######


//mathlist ###
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
		dimensions: calcBoundingDimensions(positionedItems),
		items: positionedItems
	};
};


//fraction ###
const normalizedRuleThickness = 0.05;
const getRuleThickness = style => style.fontSize * normalizedRuleThickness;
const layoutFraction = (style, fraction) => {
	const subStyle = incrementStyleType(style);
	const [num, denom] = [fraction.numerator, fraction.denominator].map(layoutWithStyle(subStyle));
	const width = Math.max(...[num, denom].map(n => n.dimensions.width));

	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const topSpacing = ruleThickness * 6;
	const bottomSpacing = ruleThickness * 6;

	const yMax = halfRuleThickness + topSpacing + dimensionHeight(num.dimensions);
	const yMin = -(halfRuleThickness + bottomSpacing + dimensionHeight(denom.dimensions));

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
		dimensions: { width, yMin, yMax }
	};
};

//delimiter ###
const layoutDelimiter = (style, delim) => {
	//from em space
	const fontSize = style.fontSize * (delim.sizeRatio || 1);
	const dimensions = R.map(val => val * fontSize / 1000, delim.metrics);
	if (delim.type === "char") {
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
		dimensions: calcBoundingDimensions(items),
		style, items
	};
};


//root ###
const layoutRoot = (style, root) => {
	const { fontSize } = style;
	const radicandLayouted = layoutNode(style, root.radicand);

	const radicandDim = radicandLayouted.dimensions;
	const radicandDimEm = R.map(scaleMap(1 / fontSize), radicandLayouted.dimensions);
	const margin = [0.07, 0.18];
	const [radicandWidth, radicandHeight] = [
		margin[0] * 2 + radicandDimEm.width,
		margin[1] * 2 + dimensionHeight(radicandDimEm)
	];

	const radical = createRadical(radicandWidth, radicandHeight, fontSize / 50);
	const rootMetrics = R.map(scaleMap(fontSize), radical.metrics);
	const rootContours = radical.contours;

	const spareYHalf = (radical.innerHeight * fontSize - radicandDim.yMax + radicandDim.yMin) * 0.7;
	const contourY = spareYHalf - (rootMetrics.yMax - radicandDim.yMax);
	const contoursOffset = [0, contourY];

	const radicandPosition = [
		fontSize * (radical.innerStartX + margin[0]), 0
	];
	Object.assign(radicandLayouted, { position: radicandPosition });

	const radicalLayouted = {
		type: "contours", style,
		contours: rootContours,
		position: [contoursOffset[0], contoursOffset[1] + radicandPosition[1]],
		dimensions: rootMetrics
	};


	//index
	const indexLayouted = root.index ? (function () {
		const indexStyle = switchStyleType(style, "SS");
		const indexLayouted = layoutNode(indexStyle, root.index);
		const scaledCorner = radical.indexCorner.map(scaleMap(style.fontSize));
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

	const dimensions = calcBoundingDimensions([radicalLayouted, indexLayouted].filter(isDefined));

	return {
		type: "root", dimensions,
		radical: radicalLayouted,
		radicand: radicandLayouted,
		...(indexLayouted ? { index: indexLayouted } : {})
	}
};

//char ###
const getDimensionsOfCharNode = (style, node) => {
	const fontData = lookUpGlyphByCharOrAlias(node.value);
	const metrics = getMetricsObject(fontData.fontFamily, getDefaultEmphasis(fontData.fontData), fontData.unicode);
	return R.map(scaleMap(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
const layoutCharNode = (style, node) => {
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const char = String.fromCharCode(unicode);
	return {
		type: "char", char, unicode,
		style: { 
			emphasis: getDefaultEmphasis(fontFamily),
			...style, 
			fontName 
		},
		dimensions: getDimensionsOfCharNode(style, node)
	};
};


const nodeLayoutFuncMap = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot
};
export const layoutNode = (style, node) => {
	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type](style, node);
	}
	if (isFormulaNodeGlyph(node)) {
		return layoutCharNode(style, node);
	}
};
const layoutWithStyle = (style) => (node => layoutNode(style, node));
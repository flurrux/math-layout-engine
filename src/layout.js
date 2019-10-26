import { scaleMap, identity, isDefined } from "./util";
import { nodeType, glyphTypes, isNodeTextual, compositeTypes, isNodeChar, isNodeText } from "./node-types";
import * as R from 'ramda';
import { layoutScript } from "./script-layout";


//layout util ###

export const calcCentering = (size, availableSize) => (availableSize - size) / 2;

export const dimensionHeight = dimensions => dimensions.yMax - dimensions.yMin;

export const boxRight = boxNode => boxNode.position[0] + boxNode.dimensions.width;
export const boxTop = boxNode => boxNode.position[1] + boxNode.dimensions.yMax;
export const boxBottom = boxNode => boxNode.position[1] + boxNode.dimensions.yMin;

export const calcBoundingDimensions = objs => identity({
	width: Math.max(...objs.map(boxRight)),
	yMin: Math.min(...objs.map(boxBottom)),
	yMax: Math.max(...objs.map(boxTop)),
});

const offsetDimensionsVertically = (dimensions, offset) => identity({
	...dimensions,
	yMin: dimensions.yMin + offset,
	yMax: dimensions.yMax + offset
});

const scaleMetrics = (metrics, scale) => R.map(scaleMap(scale), metrics);

export const withPosition = (layoutNode, position) => R.assoc("position", position, layoutNode);


const isNodeOfAnyType = (node, types) => types.includes(node.type);

//axisHeight means the vertical position of the axis relative to the baseline. 
//this value is fixed and only scales with the font-size.
const normalizedAxisHeight = 0.25;
export const getAxisHeight = style => style.fontSize * normalizedAxisHeight;

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
const getIndexOfFormulaNodeType = type => compositeTypes.includes(type) ? 7 : glyphTypes.indexOf(type);
export const getHorizontalSpacingBetweenNodes = (typeA, typeB) => {
	const [ind1, ind2] = [typeA, typeB].map(getIndexOfFormulaNodeType);
	if (ind1 < 0 || ind2 < 0) {
		return 0;
	}
	return 2 * nodeSpacingTable[ind1][ind2] / 18;
};




export const isNodeAlignedToBaseline = (node) => isNodeOfAnyType(node, ["mathlist", "script"]) ||
	isNodeTextual(node) || (node.type === "root" && isNodeAlignedToBaseline(node.radicand));

const isNodeAlignedToAxis = (node) => isNodeOfAnyType(node, ["fraction"]) ||
	(node.type === "root" && isNodeAlignedToAxis(node.radicand));

//if a node is aligned to the axis rather than the baseline, this function will get the vertical offset
export const getAxisAlignment = (style, node) => isNodeAlignedToAxis(node) ? getAxisHeight(style) : 0;

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

//mathlist ###
const layoutMathList = (style, mathList) => {
	const items = mathList.items;
	const layoutItems = items.map((item, ind) => layoutNode(style, item));

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

import { layoutFraction } from './fraction-layout.js';
import { layoutDelimited } from './delimited-layout.js';
import { createRadical } from "./create-radical";
import { layoutTextNode } from './text-layout.js';
import { layoutCharNode } from './char-layout.js';
const nodeLayoutFuncMap = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot
};
const getLayoutFuncByNode = node => {
	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type];
	}
	if (isNodeChar(node)) return layoutCharNode;
	if (isNodeText(node)) return layoutTextNode;
};
export const layoutNode = (style, node) => getLayoutFuncByNode(node)(style, node);
export const layoutWithStyle = (style) => (node => layoutNode(style, node));
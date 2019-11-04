import { scaleMap, identity } from "../util.js";
import { nodeType, isNodeTextual, isNodeChar, isNodeText } from "../node-types.js";
import * as R from 'ramda';
import { layoutScript } from "./script-layout";


//layout util ###

export const dimensionHeight = dimensions => dimensions.yMax - dimensions.yMin;

export const boxRight = boxNode => boxNode.position[0] + boxNode.dimensions.width;
export const boxTop = boxNode => boxNode.position[1] + boxNode.dimensions.yMax;
export const boxBottom = boxNode => boxNode.position[1] + boxNode.dimensions.yMin;
export const boxLeft = boxNode => boxNode.position[0];

export const calcBoundingDimensions = objs => identity({
	width: Math.max(...objs.map(boxRight)),
	yMin: Math.min(...objs.map(boxBottom)),
	yMax: Math.max(...objs.map(boxTop)),
});






const isNodeOfAnyType = (node, types) => types.includes(node.type);

//axisHeight means the vertical position of the axis relative to the baseline. 
//this value is fixed and only scales with the font-size.
const normalizedAxisHeight = 0.25;
export const getAxisHeight = style => style.fontSize * normalizedAxisHeight;


export const isNodeAlignedToBaseline = (node) => isNodeOfAnyType(node, ["mathlist", "script"]) ||
	isNodeTextual(node) || (node.type === "root" && isNodeAlignedToBaseline(node.radicand));

const isNodeAlignedToAxis = (node) => isNodeOfAnyType(node, ["fraction"]) ||
	(node.type === "root" && isNodeAlignedToAxis(node.radicand));

//if a node is aligned to the axis rather than the baseline, this function will get the vertical offset
export const getAxisAlignment = (style, node) => isNodeAlignedToAxis(node) ? getAxisHeight(style) : 0;





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


import { layoutFraction } from './fraction-layout.js';
import { layoutDelimited } from './delimited-layout.js';
import { layoutRoot } from './root-layout.js';
import { layoutTextNode } from './text-layout.js';
import { layoutCharNode } from './char-layout.js';
import { layoutMathList } from './mathlist-layout.js';
import { layoutMatrix } from './matrix-layout.js';
import { layoutAccent } from './accent-layout.js';
import { withStyle } from "../style.js";

const nodeLayoutFuncMap = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot,
	"matrix": layoutMatrix,
	"accented": layoutAccent
};
const getLayoutFuncByNode = node => {
	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type];
	}
	if (isNodeChar(node)) return layoutCharNode;
	if (isNodeText(node)) return layoutTextNode;
};
export const layoutNode = (node) => getLayoutFuncByNode(node)(node);
export const layoutWithStyle = (style) => R.pipe(withStyle(style), layoutNode);
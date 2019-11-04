import { nodeType, isNodeTextual, isNodeChar, isNodeText } from "../node-types.js";
import { map, pipe, range } from 'ramda';


//pre-processing ###

const getSubNodePaths = node => {
	if (node.type === nodeType.mathlist) {
		return map(index => ["items", index], range(0, node.items.length));
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


import { layoutScript } from "./script-layout";
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
export const layoutWithStyle = (style) => pipe(withStyle(style), layoutNode);
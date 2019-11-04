


//pre-processing ###
/*
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
*/
// const mapFormulaTree = (mapFunc, formulaNode) => {};
// const insertCharCode = node => isNodeChar(node) ? { ...node, unicode:  } : node;
// const insertCharCodes = parent => mapFormulaTree(insertCharCode, parent);


//layout ###

import { FormulaNode, BoxNode } from '../types';
interface LayoutFunction {
	(node: FormulaNode): BoxNode
}

import { nodeType, isNodeTextual, isNodeChar, isNodeText } from "../node-types";
import { map, pipe, range } from 'ramda';

import { layoutScript } from "./script-layout";
import { layoutFraction } from './fraction-layout';
import { layoutDelimited } from './delimited-layout';
import { layoutRoot } from './root-layout';
import { layoutTextNode } from './text-layout';
import { layoutCharNode } from './char-layout';
import { layoutMathList } from './mathlist-layout';
import { layoutMatrix } from './matrix-layout';
import { layoutAccent } from './accent-layout';
import { withStyle } from "../style";



const nodeLayoutFuncMap : { [key: string]: LayoutFunction } = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot,
	"matrix": layoutMatrix,
	"accented": layoutAccent
};
const getLayoutFuncByNode = (node: FormulaNode): LayoutFunction => {
	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type];
	}
	if (isNodeChar(node)) return layoutCharNode;
	if (isNodeText(node)) return layoutTextNode;
};
export const layoutNode : LayoutFunction = (node: FormulaNode) : BoxNode => getLayoutFuncByNode(node)(node);
export const layoutWithStyle = (style: any) : LayoutFunction => pipe(withStyle(style), layoutNode) as LayoutFunction;
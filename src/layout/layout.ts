


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

import { isNodeChar, isNodeText } from "../node-types";
import { pipe } from 'ramda';

import { layoutScript } from "./script-layout";
import { layoutFraction } from './fraction-layout';
import { layoutDelimited } from './delimiter/delimited-layout';
import { layoutRoot } from './root/root-layout';
import { layoutTextNode } from './text-layout';
import { layoutCharNode } from './char-layout';
import { layoutMathList } from './mathlist-layout';
import { layoutMatrix } from './matrix-layout';
import { layoutAccent } from './accent-layout';
import { Style, withStyle } from "../style";

interface LayoutFunction {
	(node: FormulaNode): BoxNode
}

const nodeLayoutFuncMap : { [key: string]: LayoutFunction } = {
	"mathlist": layoutMathList,
	"fraction": layoutFraction,
	"script": layoutScript,
	"delimited": layoutDelimited,
	"root": layoutRoot,
	"matrix": layoutMatrix,
	"accented": layoutAccent
};

class InvalidNodeError extends Error {
	constructor(message: string){
		super(message);
		this.name = "InvalidNodeError";
	}
}
class UntypedNodeError extends Error {
	constructor(message: string){
		super(message);
		this.name = "UntypedNodeError";
	}
}

const getLayoutFuncByNode = (node: FormulaNode): LayoutFunction => {
	if (typeof(node) !== "object"){
		throw 'this node is not an object!';
	}
	if (node.type === undefined){
		throw new UntypedNodeError("this node is lacking a type.");
	}


	if (Reflect.ownKeys(nodeLayoutFuncMap).includes(node.type)) {
		return nodeLayoutFuncMap[node.type];
	}
	if (isNodeChar(node)) return layoutCharNode;
	if (isNodeText(node)) return layoutTextNode;
	

	throw new InvalidNodeError(node.type === "char" ? 
		"char is not a valid node-type. use ord, bin, ... instead." : 
		`"${node.type}" is not a valid node-type`);
};

export const layoutNode : LayoutFunction = (node: FormulaNode) : BoxNode => getLayoutFuncByNode(node)(node);
export const layoutWithStyle = (style: any) : LayoutFunction => pipe(withStyle(style), layoutNode) as LayoutFunction;

//this is the main function to call for layouting the root-node (root as in tree) of a formula
const defaultStyle : Style = {
	type: "D", 
	fontSize: 40
};
export const layout = (formulaNode: FormulaNode) : BoxNode => layoutWithStyle(defaultStyle)(formulaNode);
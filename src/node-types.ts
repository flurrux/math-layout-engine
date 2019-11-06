
export const nodeType = {

	//atomic
	ord: "ord", /* ordinary (x, \alpha, \mu, ...) */ 
	op: "op", /* operator (\sum, \integral, \sin, \cos, ...) */ 
	bin: "bin", /* binary operator (+ - * / % ...) */ 
	rel: "rel", /* relation (> < = ...) */ 
	open: "open", /* open ( { [ */ 
	close: "close", /* close ) } ] */ 
	punct: "punct", /* punctuation ( , ; ) */ 

	//groups/composite
	mathlist: "mathlist", 
	fraction: "fraction",
	root: "root",
	script: "script",
	delimited: "delimited"
};

export const glyphTypes = ["ord", "op", "bin", "rel", "open", "close", "punct"];
export const compositeTypes = ["mathlist", "fraction", "root", "script", "delimited"];

import { FormulaNode, TextNode } from './types';

export const isNodeTextual = (node: FormulaNode) : boolean => isNodeChar(node) || isNodeText(node);
export const isNodeChar = (node: FormulaNode) : boolean => glyphTypes.includes(node.type) && (node as TextNode).text === undefined;
export const isNodeText = (node: FormulaNode) : boolean => (node.type === "ord" || node.type === "op") && (node as TextNode).text !== undefined;
export const isNodeComposite = (node: FormulaNode) : boolean => compositeTypes.includes(node.type);
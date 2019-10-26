
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

export const isNodeTextual = (node) => isNodeChar(node) || isNodeText(node);
export const isNodeChar = (node) => glyphTypes.includes(node.type) && node.text === undefined;
export const isNodeText = (node) => node.type === "ord" && node.text !== undefined;
export const isNodeComposite = (node) => compositeTypes.includes(node.type);
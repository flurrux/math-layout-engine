import { FormulaNode } from "../types";

export type Token = {
	type: string
	value: string,
	[key: string]: any
};

export type ParseNode = Token | FormulaNode;

// ^
export type SuperScript = Token & { type: "superscript" };

// _
export type SubScript = Token & { type: "subscript" };

// {
export type GroupOpen = Token & { type: "group-open" };

// }
export type GroupClose = Token & { type: "group-close" };

// \frac({}{}), \root({}{}), \matrix(rowCount, 
// colCount, {}), \accent({}{}), \text()
export type ParseFunctionName = Token & { type: "parse-function-name" };

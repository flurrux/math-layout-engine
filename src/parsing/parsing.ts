
import { curry, flatten, last, pipe, range } from 'ramda';
import { AccentNode, CharNode, DelimitedNode, FormulaNode, FractionNode, MathListNode, MatrixNode, RootNode, ScriptNode } from "../types";
import { GroupClose, GroupOpen, ParseFunctionName, ParseNode, SubScript, SuperScript } from './token-types';
import { tokenize } from './tokenization';


const matchTypeAndValue = curry(
	(type: string, value: string, toMatch: ParseNode): boolean => {
		return toMatch.type === type && (toMatch as any).value === value
	}
);
const openToClosingCharMap = {
	"(": ")",
	"[": "]",
	"{": "}",
	"|": "|"
};
const isNodeOfType = (node: ParseNode, type: string): boolean => node.type === type;
const isNodeOfAnyType = (node: ParseNode, types: string[]): boolean => types.includes(node.type);

//group and delimiter ###

type NodeMatchFunc = (toMatch: ParseNode) => boolean;
const getIndexOfLayerEnd = (tokens: ParseNode[], startIndex: number, isStartToken: NodeMatchFunc, isEndToken: NodeMatchFunc) => {
	let level = 1;
	for (let i = startIndex + 1; i < tokens.length; i++) {
		const token = tokens[i];
		if (isStartToken(token)) {
			level++;
			continue;
		}
		if (isEndToken(token)) {
			level--;
			if (level === 0) {
				return i;
			}
		}
	}
	return -1;
};
const parseSubLayers = (nodes: ParseNode[]): (FormulaNode | ParseFunctionName | SuperScript | SubScript)[] => {
	const processed: (FormulaNode | ParseFunctionName | SuperScript | SubScript)[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isNodeOfAnyType(node, ["group-open", "open"])) {
			const closingType = node.type === "group-open" ? "group-close" : "close";
			const nodeValue = (node as (GroupOpen | GroupClose | CharNode)).value;
			const endIndex = getIndexOfLayerEnd(
				nodes, i,
				matchTypeAndValue(node.type, nodeValue),
				matchTypeAndValue(closingType, openToClosingCharMap[nodeValue])
			);
			if (endIndex < 0) {
				throw 'no corresponding closing delimiter found';
			}

			const subLayer = nodes.slice(i + 1, endIndex);
			const subLayerParsed = parseTokenLayer(subLayer);
			if (node.type === "group-open") {
				processed.push(subLayerParsed)
			}
			else {
				processed.push({
					type: "delimited",
					delimited: subLayerParsed,
					leftDelim: nodes[i],
					rightDelim: nodes[endIndex]
				} as DelimitedNode);
			}

			i = endIndex;
			continue;
		}
		//if there is a right-brace without a corresponding left-brace, ignore it
		if (isNodeOfType(node, "group-close")) continue;
		processed.push(node as (FormulaNode | ParseFunctionName | SuperScript | SubScript));
	}
	return processed;
};


//functions ###

const parseFractionFunc = (args: FormulaNode[]): FractionNode => {
	if (args.length !== 2) {
		throw 'fractions need exactly two arguments';
	}
	return {
		type: "fraction",
		numerator: args[0],
		denominator: args[1]
	} as FractionNode;
};
const parseRootFunc = (args: FormulaNode[]): RootNode => {
	if (args.length === 0 || args.length > 2) {
		throw 'roots take either one or two arguments';
	}

	if (args.length === 1) {
		return {
			type: "root",
			radicand: args[0]
		} as RootNode;
	}
	else {
		return {
			type: "root",
			radicand: args[0],
			index: args[1]
		} as RootNode;
	}
};
const parseAccentFunc = (args: FormulaNode[]): AccentNode => {
	if (args.length !== 2) {
		throw 'accents need exactly two arguments';
	}
	return {
		type: "accented",
		nucleus: args[0],
		accent: args[1]
	} as AccentNode;
};
const parseMatrixFunc = (args: FormulaNode[]): MatrixNode => {
	if (args.length < 1) {
		throw 'matrix must have more than 1 argument';
	}
	let rows: FormulaNode[][] = [[]];
	let maxRowSize: number = 0;
	for (let i = 0; i < args.length; i++) {
		const node = args[i];
		if (matchTypeAndValue("punct", ",", node)) {
			rows.push([]);
			continue;
		}
		rows[rows.length - 1].push(node);
		maxRowSize = Math.max(maxRowSize, last(rows).length);
	}
	const emptyNode = {
		type: "mathlist",
		items: []
	} as MathListNode;

	//fill the rows so the matrix is uniform
	rows = rows.map(row => [
		...row,
		...range(0, maxRowSize - row.length).map(() => emptyNode)
	]);

	return {
		type: "matrix",
		rowCount: rows.length,
		colCount: maxRowSize,
		items: flatten(rows)
	} as MatrixNode;
};
const functionNameToParseMap: { [name: string]: (args: FormulaNode[]) => FormulaNode } = {
	"frac": parseFractionFunc,
	"root": parseRootFunc,
	"accent": parseAccentFunc,
	"matrix": parseMatrixFunc
};
const isDelimitedByParenthesis = (node: ParseNode): boolean => {
	return (node.type === "delimited" && (((node as DelimitedNode).leftDelim) as CharNode).value === "(");
};
const isOpenParenthesis = (node: ParseNode): boolean => matchTypeAndValue("open", "(", node);
const parseFunctionArgs = (nodes: ParseNode[]): FormulaNode[] => {
	const processed = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isNodeOfType(node, "group-open")) {
			const groupCloseIndex = getIndexOfLayerEnd(
				nodes, i,
				matchTypeAndValue("group-open", "{"),
				matchTypeAndValue("group-close", "}")
			);
			if (groupCloseIndex < 0) {
				throw 'brace-group was not closed';
			}
			const group = nodes.slice(i + 1, groupCloseIndex);
			processed.push(parseTokenLayer(group));
			i = groupCloseIndex;
			continue;
		}
		if (!matchTypeAndValue("punct", ",", node)) {
			throw `node of type "${node.type}" is not allowed in an argument-list`;
		}
		processed.push(node);
	}
	return processed;
};
const parseFunctions = (nodes: ParseNode[]): (FormulaNode | SuperScript | SubScript | GroupOpen | GroupClose)[] => {
	const processed: (FormulaNode | SuperScript | SubScript | GroupOpen | GroupClose)[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isNodeOfType(node as ParseNode, "parse-function-name")) {
			const funcName = (node as ParseFunctionName).value;
			if (!functionNameToParseMap[funcName]) {
				throw `${funcName} is not a valid function`;
			}
			if (i === nodes.length - 1 || !isOpenParenthesis(nodes[i + 1])) {
				throw `function ${funcName} is missing arguments`;
			}
			const endIndex = getIndexOfLayerEnd(
				nodes, i + 1,
				matchTypeAndValue("open", "("),
				matchTypeAndValue("close", ")")
			);
			if (endIndex < 0) {
				throw 'parenthesis are not closed';
			}

			const funcArgs = parseFunctionArgs(nodes.slice(i + 2, endIndex));
			processed.push(functionNameToParseMap[funcName](funcArgs));
			i = endIndex;
			continue;
		}
		processed.push(node as (FormulaNode | SuperScript | SubScript | GroupOpen | GroupClose));
	}
	return processed;
};


const isSubOrSuperscript = (node: (FormulaNode | SuperScript | SubScript)): boolean => {
	return isNodeOfAnyType(node, ["subscript", "superscript"])
};
const parseScripts = (nodes: (FormulaNode | SuperScript | SubScript)[]): FormulaNode[] => {
	const processed: FormulaNode[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isSubOrSuperscript(node)) {
			throw 'a sub- or super-script must be preceded by a node';
		}
		if (i === nodes.length - 1 || !isSubOrSuperscript(nodes[i + 1])) {
			processed.push(node as FormulaNode);
			continue;
		}

		const nextNode = nodes[i + 1];
		const remainingNodeCount = nodes.length - i - 1;
		const isSuperscript = isNodeOfType(nextNode, "superscript");
		const curScriptType = nextNode.type;
		const nextScriptType = isSuperscript ? "subscript" : "superscript";
		if (remainingNodeCount === 1 || isSubOrSuperscript(nodes[i + 2])) {
			throw `${curScriptType} expected`;
		}
		const scriptNode = {
			type: "script",
			nucleus: nodes[i]
		} as ScriptNode;
		scriptNode[isSuperscript ? "sup" : "sub"] = nodes[i + 2] as FormulaNode;

		if (remainingNodeCount === 2 || !isNodeOfType(nodes[i + 3], nextScriptType)) {
			processed.push(scriptNode);
			i += 2;
			continue;
		}

		if (remainingNodeCount === 3) {
			throw `${nextScriptType} expected`;
		}
		scriptNode[isSuperscript ? "sub" : "sup"] = nodes[i + 4] as FormulaNode;
		processed.push(scriptNode);
		i += 4;
	}
	return processed;
};

const layerToMathlistOrSingleNode = (nodes: FormulaNode[]): (FormulaNode | MathListNode) => {
	if (nodes.length === 1) return nodes[0];
	return {
		type: "mathlist",
		items: nodes
	};
};

const isPotentialUnaryOperator = (node: FormulaNode): boolean => {
	if (node.type !== "bin") return false;
	const char = (node as CharNode).value;
	return ["+", "-", "−"].includes(char);
};
const isOperand = (node: FormulaNode): boolean => {
	return !["bin", "rel", "punct"].includes(node.type);
};
const handleUnaryOperators = (nodes: FormulaNode[]): FormulaNode[] => {
	if (nodes.length === 1) return nodes;
	const processed = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!isPotentialUnaryOperator(node)) {
			processed.push(node);
			continue;
		}
		if (i === 0 || i === nodes.length - 1) {
			processed.push({
				...node,
				type: "ord"
			});
			continue;
		}

		const leftOperand = processed[i - 1];
		const rightOperand = nodes[i + 1];
		if (!isOperand(leftOperand) || !isOperand(rightOperand)) {
			processed.push({
				...node,
				type: "ord"
			});
			continue;
		}

		processed.push(node);
	}
	return processed;
};

export const parseTokenLayer = (layer: ParseNode[]): FormulaNode => pipe(
	parseFunctions,
	parseSubLayers,
	parseScripts,
	handleUnaryOperators,
	layerToMathlistOrSingleNode
)(layer);


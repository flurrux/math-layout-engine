import { curry, last } from "ramda";
import { CharNode, FormulaNode, TextNode, TextualType } from "../types";
import { GroupClose, GroupOpen, ParseFunctionName, ParseNode, SubScript, SuperScript, Token } from "./token-types";
import { unicodeToTypeMap } from "../type-from-unicode";
import { aliasMap, getDefaultEmphasis } from "../font-data/katex-font-util";


export const tokenize = (expression: string): ParseNode[] => {
	let result: PartiallyProcessedExpression = [expression];
	for (const tokenizeFunc of tokenizeFuncs) {
		result = tokenizeStringParts(tokenizeFunc, result);
	}
	return result as ParseNode[];
};


type PartiallyProcessedExpression = (string | Token | FormulaNode)[];
type TokenizationFunction = (expression: string) => PartiallyProcessedExpression;

const appendOrPushChar = (array: any[], char: string): any[] => {
	if (array.length === 0 || typeof (last(array)) !== "string") {
		array.push(char);
	}
	else {
		array[array.length - 1] += char;
	}
	return array;
};
const isArray = (val: any): boolean => Array.isArray(val);

const tokenizeTextFunctions = (expression: string): (string | TextNode)[] => {
	let processed: (string | TextNode)[] = [];
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		const restString = expression.substr(i);
		if (restString.startsWith("\\text(")) {
			const textStartIndex = i + 6;
			const textEndIndex = expression.indexOf(")", textStartIndex);
			if (textEndIndex < 0) {
				throw 'text-function is missing a closing parenthesis';
			}
			const textVal = expression.substring(textStartIndex, textEndIndex);
			processed.push({
				type: "ord",
				text: textVal
			} as TextNode);
			i = textEndIndex;
			continue;
		}
		if (restString.startsWith("\\opname(")) {
			const textStartIndex = i + 8;
			const textEndIndex = expression.indexOf(")", textStartIndex);
			if (textEndIndex < 0) {
				throw 'operator-name-function is missing a closing parenthesis';
			}
			const textVal = expression.substring(textStartIndex, textEndIndex);
			processed.push({
				type: "op",
				text: textVal
			} as TextNode);
			i = textEndIndex;
			continue;
		}
		processed = appendOrPushChar(processed, char);
	}
	return processed;
};

//alias and function-names ###
const getNodeTypeByUnicode = (unicode: number): TextualType => {
	let nodeType = unicodeToTypeMap[unicode];
	if (!nodeType) {
		console.warn(`${String.fromCharCode(unicode)} has no corresponding type. maybe add an entry in "type-from-unicode.ts" `);
		nodeType = "ord";
	}
	return nodeType;
};
const getMatchingAlias = (str: string): { alias: string, unicode: number, fontFamily: string } => {
	let curMatch = null;
	for (let i = 0; i < aliasMap.length; i++) {
		const aliasEntry = aliasMap[i];
		for (let j = 0; j < aliasEntry.alias.length; j++) {
			const curAlias = aliasEntry.alias[j];
			if (!str.startsWith(curAlias)) continue;

			if (!curMatch || curAlias.length > curMatch.alias.length) {
				curMatch = {
					alias: curAlias,
					unicode: aliasEntry.unicode,
					fontFamily: aliasEntry.fontFamily
				};
			}
		}
	}
	return curMatch;
};

const parseFunctionNames = [
	"frac", "root", "accent", "matrix", "text"
];
const getMatchingParseFunction = (str: string): string | undefined => {
	return parseFunctionNames.find( funcName => str.startsWith(funcName) );
};

const isEscapeChar = (char: string) => char.charCodeAt(0) === 92;

const tokenizeEscapeSequences = (expression: string): (string | ParseFunctionName | CharNode)[] => {
	let processed: (string | ParseFunctionName | CharNode)[] = [];
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		if (isEscapeChar(char)) {
			const restString = expression.substr(i + 1);

			const parseFuncName = getMatchingParseFunction(restString);
			if (parseFuncName) {
				processed.push({
					type: "parse-function-name",
					value: parseFuncName
				} as ParseFunctionName);
				i += parseFuncName.length;
				continue;
			}

			const aliasMatch = getMatchingAlias(restString);
			if (aliasMatch) {
				const { unicode } = aliasMatch;
				let nodeType = unicodeToTypeMap[unicode];
				if (!nodeType) {
					console.warn(`found a match for the alias ${aliasMatch.alias} but not a corresponsing type. maybe add an entry in "type-from-unicode.ts" `);
					nodeType = "ord";
				}
				processed.push({
					type: nodeType,
					value: String.fromCharCode(unicode),
					style: {
						fontFamily: aliasMatch.fontFamily,
						emphasis: getDefaultEmphasis(aliasMatch.fontFamily)
					}
				} as CharNode);
				i += aliasMatch.alias.length;
				continue;
			}

			throw `could not find a match for escaped string "${restString}"`;
		}
		processed = appendOrPushChar(processed, char);
	}
	return processed;
};


//number literals ###

const isDigit = (char: string): boolean => (
	["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)
);

const tokenizeNumberLiterals = (expression: string): (string | CharNode | TextNode)[] => {
	let processed: (string | CharNode | TextNode)[] = [];
	let numberSequenceStarted = false;
	let curNumberSequence: string | null = null;
	const pushCurrentNumber = () => {
		processed.push(
			curNumberSequence.length > 1 ?
				{ type: "ord", text: curNumberSequence } as TextNode :
				{ type: "ord", value: curNumberSequence } as CharNode
		);
	};
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		if (isDigit(char) || char === ".") {
			if (!numberSequenceStarted) {
				numberSequenceStarted = true;
				curNumberSequence = "";
			}
			curNumberSequence += char;
		}
		else {
			if (numberSequenceStarted) {
				pushCurrentNumber();
				numberSequenceStarted = false;
			}
			processed = appendOrPushChar(processed, char);
		}
	}
	if (numberSequenceStarted) {
		pushCurrentNumber();
	}
	return processed;
};



const tokenizeBraces = (expression: string): (string | GroupOpen | GroupClose)[] => {
	let processed: (string | GroupOpen | GroupClose)[] = [];
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		if (char === "{") {
			processed.push({
				type: "group-open",
				value: char
			} as GroupOpen);
			continue;
		}
		if (char === "}") {
			processed.push({
				type: "group-close",
				value: char
			} as GroupClose);
			continue;
		}
		processed = appendOrPushChar(processed, char);
	}
	return processed;
};

const tokenizeScripts = (expression: string): (string | SuperScript | SubScript)[] => {
	let processed: (string | SuperScript | SubScript)[] = [];
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		if (char === "^") {
			processed.push({
				type: "superscript",
				value: "^"
			} as SuperScript);
			continue;
		}
		if (char === "_") {
			processed.push({
				type: "subscript",
				value: "_"
			} as SubScript);
			continue;
		}
		processed = appendOrPushChar(processed, char);
	}
	return processed;
};

const ignoredUnicodes = [
	32 /*space*/,
	9 /*tab*/,
	10, /*return*/
];
const isCharIgnored = (unicode: number) => ignoredUnicodes.includes(unicode);
const tokenizeChars = (expression: string): (string | CharNode)[] => {
	const processed: (string | CharNode)[] = [];
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		const unicode = char.charCodeAt(0);
		if (isCharIgnored(unicode)) continue;
		const nodeType = getNodeTypeByUnicode(unicode);
		processed.push({
			type: nodeType,
			value: String.fromCharCode(unicode),
		} as CharNode);
	}
	return processed;
};

const tokenizeStringParts = curry(
	(tokenizeFunc: TokenizationFunction, partialExpression: PartiallyProcessedExpression): PartiallyProcessedExpression => {
		const tokenized: PartiallyProcessedExpression = [];
		for (let i = 0; i < partialExpression.length; i++) {
			const part = partialExpression[i];
			if (typeof (part) === "string") {
				tokenized.push(...tokenizeFunc(part as string));
			}
			else {
				tokenized.push(part);
			}
		}
		return tokenized;
	}
);

const tokenizeFuncs: TokenizationFunction[] = [
	tokenizeTextFunctions,
	tokenizeEscapeSequences,
	tokenizeNumberLiterals,
	tokenizeBraces,
	tokenizeScripts,
	tokenizeChars
];

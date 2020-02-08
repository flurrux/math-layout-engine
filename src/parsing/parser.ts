/*
    the parse-function takes an expression as string, and outputs a FormulaNode. 
    
    examples of expressions:
    a + b + 3 * c = d / 5
    2 * \pi = \tau
    f(t) = 4 - 2 * t + 5 * t^3
    f(t) = c_0 + c_1 * t + c_2 * t^2 + c_3 * t^3 + \...
    2^{2^2} = 8
    t_1^3 * t_2^2 * t_4 * t_5^3
    (\frac({1}{2 + (\frac({1}{3 + (\frac({1}{4 + \...}))}))}))

    features: 
	- binary operators, relations, punctuation 
	- unary operators
    - numbers, 24, 0.01, 3.1457
    - sub- and superscripts, a^b, a_c, a^b_c, a_c^b,
        a^b_c and a_c^b are equivalent, order does not matter
    - special characters by \[alias], example: \gamma
    - grouping by {}, everything inside curly braces will be parsed to a single node
    - autosized delimiter, ()[]{}⌈⌉⌊⌋||, 
        curly braces must be escaped to act as delimiters: \{ and \}
    - roots, 
        root({2}) is the square-root of 2
		root({2}{3}) is the cube-root of 2
	- fractions, \fraction({1}{2})	
	- accents, example: \accent({v}{\vector})
	- matrix, example: \matrix({1}{0}, {0}{1}), 
		the size of the matrix is infered from the colons
    - text


    todo: 
    - maybe instead of frac({a}{b}) just use a / b,
    and if inline fractions are desired, escape the slash: a \/ b
    - better handling of text-functions, 
        currently, the end of a text-function is determined by 
        looking at the corresponding closing parenthesis. 
        however the text could be like: func(t), so: \text(func(t))
        which would we interpreted as \text(func(t) -> func(t.     
    - functions like sin, ln, ...
    - complete error handling with position of error in the text     


	algorithm: 
	- first tokenize the entire expression:
		- process text-functions, converts text-functions into FormulaNodes
		- process escape-sequences, example: \pi, \frac
			escape sequences are either function-names or aliases. 
			aliases are converted directly into FormulaNodes.
			function-names are converted into FunctionNameTokens
		- convert number-literals into either ord- or text-nodes 
		- tokenize unescaped braces 
		- convert chars to FormulaNodes, + - ; f p and so on 
	- recursively parse the tokens:
		- detect groups by delimiters and parse them recursively
        - parse functions by supplying them with their arguments
        - parse scripts 
        - if the result is an array, pack it into a mathlist, if not, return the node    

*/


import { curry, last, pipe, range, flatten } from 'ramda';
import { aliasMap } from "../font-data/katex-font-util";
import { unicodeToTypeMap } from "../type-from-unicode";
import { AccentNode, CharNode, DelimitedNode, FormulaNode, FractionNode, MathListNode, RootNode, ScriptNode, TextNode, TextualType, MatrixStyle, MatrixNode } from "../types";



//Token-types ###

interface Token {
    type: string
    value: string,
    [key: string]: any
};

type ParseNode = Token | FormulaNode;

//^
interface SuperScript extends Token { type: "superscript" };
//_
interface SubScript extends Token { type: "subscript" };

//{
interface GroupOpen extends Token { type: "group-open" };
//}
interface GroupClose extends Token { type: "group-close" };

// \frac({}{}), \root({}{}), \matrix(rowCount, colCount, {}), \accent({}{}), \text()
interface ParseFunctionName extends Token { type: "parse-function-name" };


const parseFunctionNames = [
    "frac", "root", "accent", "matrix", "text"
];




//tokenization ###

type PartiallyProcessedExpression = (string | Token | FormulaNode)[];
type TokenizationFunction = (expression: string) => PartiallyProcessedExpression;

const appendOrPushChar = (array: any[], char: string): any[] => {
    if (array.length === 0 || typeof(last(array)) !== "string"){
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
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
        const restString = expression.substr(i);
        if (restString.startsWith("\\text(")){
            const textStartIndex = i + 6;
            const textEndIndex = expression.indexOf(")", textStartIndex);
            if (textEndIndex < 0){
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
const getMatchingAlias = (str: string): { alias: string, unicode: number } => {
    let curMatch = null;
    for (let i = 0; i < aliasMap.length; i++){
        const aliasEntry = aliasMap[i];
        for (let j = 0; j < aliasEntry.alias.length; j++){
            const curAlias = aliasEntry.alias[j];
            if (!str.startsWith(curAlias)) continue;

            if (!curMatch || curAlias.length > curMatch.alias.length){
                curMatch = { alias: curAlias, unicode: aliasEntry.unicode };
            }
        }
    }
    return curMatch;
};
const getMatchingParseFunction = (str: string): string => {
    return parseFunctionNames.find(funcName => str.startsWith(funcName));
};
const isEscapeChar = (char: string) => char.charCodeAt(0) === 92;
const tokenizeEscapeSequences = (expression: string): (string | ParseFunctionName | CharNode)[] => {
    let processed: (string | ParseFunctionName | CharNode)[] = [];
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
        if (isEscapeChar(char)){
            const restString = expression.substr(i + 1);
            
            const parseFuncName = getMatchingParseFunction(restString);
            if (parseFuncName){
                processed.push({
                    type: "parse-function-name",
                    value: parseFuncName
                } as ParseFunctionName);
                i += parseFuncName.length;
                continue;
            }

            const aliasMatch = getMatchingAlias(restString);
            if (aliasMatch){
                const { unicode } = aliasMatch;
                let nodeType = unicodeToTypeMap[unicode];
                if (!nodeType){
                    console.warn(`found a match for the alias ${aliasMatch.alias} but not a corresponsing type. maybe add an entry in "type-from-unicode.ts" `);
					nodeType = "ord";
				}
                processed.push({
                    type: nodeType,
                    value: String.fromCharCode(unicode),
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

const isDigit = (char: string): boolean => ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char);
const tokenizeNumberLiterals = (expression: string): (string | CharNode | TextNode)[] => {
    let processed: (string | CharNode | TextNode)[] = [];
    let numberSequenceStarted = false;
    let curNumberSequence: string = null;
    const pushCurrentNumber = () => {
        processed.push(
            curNumberSequence.length > 1 ? 
            { type: "ord", text: curNumberSequence } as TextNode : 
            { type: "ord", value: curNumberSequence } as CharNode
        );
    };
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
		if (isDigit(char) || char === "."){
            if (!numberSequenceStarted){
                numberSequenceStarted = true;
                curNumberSequence = "";
            }
            curNumberSequence += char;
        }
        else {
            if (numberSequenceStarted){
                pushCurrentNumber();
                numberSequenceStarted = false;
            }
            processed = appendOrPushChar(processed, char);
        }
    }
    if (numberSequenceStarted){
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
    let processed:  (string | SuperScript | SubScript)[] = [];
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
        if (char === "^"){
            processed.push({
                type: "superscript",
                value: "^"
            } as SuperScript);
            continue;
        }
        if (char === "_"){
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
    for (let i = 0; i < expression.length; i++){
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
        for (let i = 0; i < partialExpression.length; i++){
            const part = partialExpression[i];
            if (typeof(part) === "string"){
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
const tokenize = (expression: string): ParseNode[] => {
    let result: PartiallyProcessedExpression = [expression];
    for (const tokenizeFunc of tokenizeFuncs){
        result = tokenizeStringParts(tokenizeFunc, result);
	}
    return result as ParseNode[];
};



//recursive parsing ###


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
    for (let i = startIndex + 1; i < tokens.length; i++){
        const token = tokens[i];
        if (isStartToken(token)){
            level++;
            continue;
        }
        if (isEndToken(token)){
            level--;
            if (level === 0){
                return i;
            }
        }
    }
    return -1;
};
const parseSubLayers = (nodes: ParseNode[]): (FormulaNode | ParseFunctionName | SuperScript | SubScript)[] => {
	const processed: (FormulaNode | ParseFunctionName | SuperScript | SubScript)[] = [];
    for (let i = 0; i < nodes.length; i++){
        const node = nodes[i];
        if (isNodeOfAnyType(node, ["group-open", "open"])){
            const closingType = node.type === "group-open" ? "group-close" : "close";
            const nodeValue = (node as (GroupOpen | GroupClose | CharNode)).value;
            const endIndex = getIndexOfLayerEnd(
                nodes, i, 
                matchTypeAndValue(node.type, nodeValue),
                matchTypeAndValue(closingType, openToClosingCharMap[nodeValue])
            );
            if (endIndex < 0){
                throw 'no corresponding closing delimiter found';
			}
			
			const subLayer = nodes.slice(i + 1, endIndex);
			const subLayerParsed = parseTokenLayer(subLayer);
			if (node.type === "group-open"){
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
		processed.push(node as (FormulaNode | ParseFunctionName | SuperScript | SubScript));
    }
	return processed;
};


//functions ###

const parseFractionFunc = (args: FormulaNode): FractionNode => {
    if (args.type !== "mathlist" || (args as MathListNode).items.length !== 2){
        throw 'fractions need exactly two arguments';
	}
	const argItems = (args as MathListNode).items;
    return {
        type: "fraction",
		numerator: argItems[0],
		denominator: argItems[1]
    } as FractionNode;
};
const parseRootFunc = (args: FormulaNode): RootNode => {
	if (args.type !== "mathlist"){
		return {
			type: "root",
			radicand: args
		} as RootNode;
	}

	if ((args as MathListNode).items.length !== 2) {
        throw 'roots take either one or two arguments';
	}
	const argItems = (args as MathListNode).items;
    return {
        type: "root",
		radicand: argItems[0],
		index: argItems[1]
    } as RootNode;
};
const parseAccentFunc = (args: FormulaNode): AccentNode => {
	if (args.type !== "mathlist" || (args as MathListNode).items.length !== 2) {
        throw 'accents need exactly two arguments';
	}
	const argItems = (args as MathListNode).items;
    return {
        type: "accented",
		nucleus: argItems[0],
		accent: argItems[1]
    } as AccentNode;
};
const parseMatrixFunc = (args: FormulaNode): MatrixNode => {
	if (args.type !== "mathlist" || (args as MathListNode).items.length < 1){
		throw 'matrix must have more than 1 argument';
	}
	const items = (args as MathListNode).items;
	let rows: FormulaNode[][] = [[]];
	let maxRowSize: number = 0;
	for (let i = 0; i < items.length; i++){
		const node = items[i];
		if (node.type === "punct" && (node as CharNode).value === ","){
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
const functionNameToParseMap: { [name: string]: (args: FormulaNode) => FormulaNode } = {
    "frac": parseFractionFunc,
    "root": parseRootFunc,
	"accent": parseAccentFunc,
	"matrix": parseMatrixFunc
};
const isDelimitedByParenthesis = (node: ParseNode): boolean => {
	return (node.type === "delimited" && (((node as DelimitedNode).leftDelim) as CharNode).value === "(");
};
const parseFunctions = (nodes: (FormulaNode | ParseFunctionName | SuperScript | SubScript)[]): (FormulaNode | SuperScript | SubScript)[] => {
	const processed: (FormulaNode | SuperScript | SubScript)[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (isNodeOfType(node as ParseNode, "parse-function-name")) {
			const funcName = (node as ParseFunctionName).value;
			if (!functionNameToParseMap[funcName]) {
				throw `${funcName} is not a valid function`;
			}
			if (i === nodes.length - 1) {
				throw `function ${funcName} is missing arguments`;
			}
			const args = nodes[i + 1];
			if (!isDelimitedByParenthesis(args)){
				throw `function ${funcName} must have arguments in parenthesis`;
			}
			const funcArgs = (args as DelimitedNode).delimited;
			processed.push(functionNameToParseMap[funcName](funcArgs));
			i++;
			continue;
		}
		processed.push(node as (FormulaNode | SuperScript | SubScript));
	}
	return processed;
};


const isSubOrSuperscript = (node: (FormulaNode | SuperScript | SubScript)): boolean => {
	return isNodeOfAnyType(node, ["subscript", "superscript"])
};
const parseScripts = (nodes: (FormulaNode | SuperScript | SubScript)[]): FormulaNode[] => {
    const processed: FormulaNode[] = [];
    for (let i = 0; i < nodes.length; i++){
		const node = nodes[i];
		if (isSubOrSuperscript(node)){
			throw 'a sub- or super-script must be preceded by a node';
		}
        if (i === nodes.length - 1 || !isSubOrSuperscript(nodes[i + 1])){
            processed.push(node as FormulaNode);
            continue;
        }
        
        const nextNode = nodes[i + 1];
        const remainingNodeCount = nodes.length - i - 1;
		const isSuperscript = isNodeOfType(nextNode, "superscript");
		const curScriptType = nextNode.type;
		const nextScriptType = isSuperscript ? "subscript" : "superscript";
        if (remainingNodeCount === 1 || isSubOrSuperscript(nodes[i + 2])){
			throw `${curScriptType} expected`;
        }
        const scriptNode = {
            type: "script",
            nucleus: nodes[i]
        } as ScriptNode;
        scriptNode[isSuperscript ? "sup" : "sub"] = nodes[i + 2] as FormulaNode;
        
        if (remainingNodeCount === 2 || !isNodeOfType(nodes[i + 3], nextScriptType)){
            processed.push(scriptNode);
            i += 2;
            continue;
        }

        if (remainingNodeCount === 3){
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
	for (let i = 0; i < nodes.length; i++){
		const node = nodes[i];
		if (!isPotentialUnaryOperator(node)){
			processed.push(node);
			continue;
		}
		if (i === 0 || i === nodes.length - 1){
			processed.push({
				...node,
				type: "ord"
			});
			continue;
		}
		
		const leftOperand = processed[i - 1];
		const rightOperand = nodes[i + 1];
		if (!isOperand(leftOperand) || !isOperand(rightOperand)){
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

const parseTokenLayer = (layer: ParseNode[]): FormulaNode => pipe(
	parseSubLayers,
    parseFunctions,
    parseScripts,
	handleUnaryOperators,
	layerToMathlistOrSingleNode
)(layer);





export const parse = (expression: string): FormulaNode => {
    return pipe(
        tokenize,
		parseTokenLayer
    )(expression);
};
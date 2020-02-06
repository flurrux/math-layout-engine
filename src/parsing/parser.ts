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
    - text, text


    todo: 
    - unary operators
    - accents
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
    - process text-functions, converts text-functions into FormulaNodes
    - process escape-sequences, example: \pi, \frac
        escape sequences are either function-names or aliases. 
        aliases are converted directly into FormulaNodes.
        function-names are converted into FunctionNameTokens
    - convert number-literals into either ord- or text-nodes 
    - tokenize unescaped braces 
    - convert chars to FormulaNodes, + - ; f p and so on 
    - create layers, by wrapping groups or delimited parts into own arrays. 
        layers denote parts which can be recursively parsed. 
        arguments of functions do not evaluate to FormuaNodes, 
        so those have to be dealt with before.
    - recursively parse layers: 
        - functions, groups, delimited in one go:
            - case: function, parse arguments recursively, create FormulaNode
            - case: group, remove ends and parse inner part as layer, create FormulaNode
            - case: delimited, parse inner part as layer and create DelimitedNode
        - parse scripts 
        - if the result is an array, pack it into a mathlist, if not, return the node    
                

*/


import { FormulaNode, DelimitedNode, MathListNode, FractionNode, RootNode, AccentNode, MatrixNode, CharNode, TextNode, ScriptNode, TextualType, TextualNode } from "../types";
import { pipe, curry, last } from 'ramda';
import { aliasMap } from "../font-data/katex-font-util";
import { unicodeToTypeMap } from "../type-from-unicode";



//Token-types ###

interface Token {
    type: string
    value: string,
    [key: string]: any
};

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



type ParseNode = Token | FormulaNode;
type ParseNodeLayerItem = ParseNode | ParseNodeLayerItem[];
type ParseNodeLayer = ParseNodeLayerItem[];

// interface DelimitedParseNode extends Token {
//     type: "delimited-layer",
//     startNode: CharNode, 
//     endNode: CharNode,

// };
// interface GroupParseNode extends Token {
//     type: "group-layer",
//     value: ParseNodeLayer
// };



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
                throw 'text was not closed by parenthesis';
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
                }
                if (!nodeType) nodeType = "ord";
                processed.push({
                    type: nodeType,
                    value: String.fromCharCode(unicode),
                } as CharNode);
                i += aliasMatch.alias.length;
                continue;
            }

            throw `could not find a match for ${restString}`;
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
        const charIsDigit = isDigit(char) || char === ".";

        if (charIsDigit){
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

const tokenizeBraces = (expression: string): (string | GroupOpen | GroupClose)[] => {
    let processed: (string | GroupOpen | GroupClose)[] = [];
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
        if (char === "{" || char === "}"){
            if (char === "{"){
                processed.push({
                    type: "group-open",
                    value: char
                } as GroupOpen);
            }
            else {
                processed.push({
                    type: "group-close",
                    value: char
                } as GroupClose);
            }
            continue;
        }
        processed = appendOrPushChar(processed, char);
    }
    return processed;
};

const tokenizeChars = (expression: string): (string | CharNode)[] => {
    const processed: (string | CharNode)[] = [];
    for (let i = 0; i < expression.length; i++){
        const char = expression[i];
        const unicode = char.charCodeAt(0);
        if (char === " " || unicode === 10) continue;
        const nodeType = unicodeToTypeMap[unicode] || "ord";
        processed.push({
            type: nodeType,
            value: char,
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
export const tokenize = (expression: string): ParseNode[] => {
    let result: PartiallyProcessedExpression = [expression];
    for (const tokenizeFunc of tokenizeFuncs){
        result = tokenizeStringParts(tokenizeFunc, result);
    }
    return result as ParseNode[];
};



//recursive parsing ###


const sliceSandwich = (array: any[]): any[] => array.slice(1, array.length - 1);
const wrapInArray = (val: any) => isArray(val) ? val : [val];
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
const createLayers = (nodes: ParseNode[]): ParseNodeLayer => {
    const layers: ParseNodeLayer = [];
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
                throw 'mismatch of opening and closing delimiter';
            }
            const subLayer = nodes.slice(i + 1, endIndex);
            layers.push([
                nodes[i],
                ...(createLayers(subLayer) as ParseNodeLayer),
                nodes[endIndex]
            ]);
            i = endIndex;
        }
        else {
            layers.push(node);
        }
    }
    return layers;
};



const parseGroup = (groupLayer: ParseNodeLayer) => parseTokenLayer(sliceSandwich(groupLayer));
const parseNodeArgument = (arg: ParseNodeLayerItem): FormulaNode => parseGroup(arg as ParseNodeLayer);
const parseFractionFunc = (args: ParseNodeLayer): FractionNode => {
    if (args.length !== 2){
        throw 'fractions need exactly two arguments';
    }
    return {
        type: "fraction",
        numerator: parseNodeArgument(args[0]),
        denominator: parseNodeArgument(args[1])
    } as FractionNode;
};
const parseRootFunc = (args: ParseNodeLayer): RootNode => {
    if (args.length < 1){
        throw 'roots need at least one argument';
    }
    return {
        type: "root",
        radicand: parseNodeArgument(args[0]),
        ...(args.length > 1 ? {
            index: parseNodeArgument(args[1])
        } : {})
    } as RootNode;
};
const parseAccentFunc = (args: ParseNodeLayer): AccentNode => {
    if (args.length !== 2){
        throw 'accents need exactly two arguments';
    }
    return {
        type: "accented",
        nucleus: parseNodeArgument(args[0]),
        accent: parseNodeArgument(args[1])
    } as AccentNode;
};
const functionNameToParseMap = {
    "frac": parseFractionFunc,
    "root": parseRootFunc,
    "accent": parseAccentFunc
};

const checkParseSandwichLayer = (layer: ParseNodeLayer): FormulaNode => {
    const firstNode = layer[0];
    if (isArray(firstNode)) return;
    if (isNodeOfType(firstNode as ParseNode, "open")){
        return {
            type: "delimited",
            leftDelim: layer[0] as FormulaNode,
            rightDelim: last(layer) as FormulaNode,
            delimited: parseTokenLayer(sliceSandwich(layer))
        } as DelimitedNode;
    }
    if (isNodeOfType(firstNode as ParseNode, "group-open")){
        return pipe(sliceSandwich, parseTokenLayer)(layer) as FormulaNode;
    }
};

const parseFunctionsDelimitersAndGroups = (layer: ParseNodeLayer): (FormulaNode[] | ParseNodeLayer) => {
    //delimiters and groups
    const firstNode = layer[0];
    if (!isArray(firstNode)){
        if (isNodeOfType(firstNode as ParseNode, "open")){
            return [{
                type: "delimited",
                leftDelim: layer[0] as FormulaNode,
                rightDelim: last(layer) as FormulaNode,
                delimited: parseTokenLayer(sliceSandwich(layer))
            } as DelimitedNode];
        }
        if (isNodeOfType(firstNode as ParseNode, "group-open")){
            return pipe(sliceSandwich, parseTokenLayer, wrapInArray)(layer) as FormulaNode[];
        }
    }

    //functions
    const processed: ParseNodeLayer = [];
    for (let i = 0; i < layer.length; i++){
        const node = layer[i];
        if (isArray(node)){
            processed.push(parseTokenLayer(node as ParseNodeLayer));
            continue;
        }
        if (isNodeOfType(node as ParseNode, "parse-function-name")){
            const funcName = (node as ParseFunctionName).value;
            if (i === layer.length - 1){
                throw `function ${funcName} is missing arguments`;
            }
            const args = layer[i + 1];
            if (!isArray(args)){
                throw `function ${funcName} must have arguments in parenthesis`;
            }
            if (!functionNameToParseMap[funcName]){
                throw `${funcName} is not a valid function`;
            }
            const funcArgs = sliceSandwich(args as ParseNodeLayer);
            processed.push(functionNameToParseMap[funcName](funcArgs));
            i++;
            continue;
        }
        processed.push(node);
    }
    return processed;
};


const parseScripts = (layer: ParseNode[]): FormulaNode[] => {
    const processed: FormulaNode[] = [];
    for (let i = 0; i < layer.length; i++){
        const node = layer[i];
        if (i === layer.length - 1 || !["superscript", "subscript"].includes(layer[i + 1].type)){
            processed.push(node as FormulaNode);
            continue;
        }
        
        const nextNode = layer[i + 1];
        const remainingNodeCount = layer.length - i - 1;
        const isSuperscript = isNodeOfType(nextNode, "superscript");
        if (remainingNodeCount === 1){
            throw `${isSuperscript ? "superscript" : "subscript"} expected`;
        }
        const scriptNode = {
            type: "script",
            nucleus: layer[i]
        } as ScriptNode;
        scriptNode[isSuperscript ? "sup" : "sub"] = layer[i + 2] as FormulaNode;
        
        if (remainingNodeCount === 2 || !["superscript", "subscript"].includes(layer[i + 3].type)){
            processed.push(scriptNode);
            i += 2;
            continue;
        }

        if (remainingNodeCount === 3 || layer[i + 3].type === nextNode.type){
            throw `${isSuperscript ? "subscript" : "superscript"} expected`;
        }
        scriptNode[isSuperscript ? "sub" : "sup"] = layer[i + 4] as FormulaNode;
        processed.push(scriptNode);
        i += 4;
    }
    return processed;
};

const layerToMathlistOrSingleNode = (layer: ParseNodeLayer): (FormulaNode | MathListNode) => {
    if (layer.length === 1) return layer[0] as FormulaNode;
    return {
        type: "mathlist",
        items: layer as FormulaNode[]
    };
};

const parseTokenLayer = (layer: ParseNodeLayer): FormulaNode => pipe(
    parseFunctionsDelimitersAndGroups,
    parseScripts,
    layerToMathlistOrSingleNode
)(layer);




export const parse = (expression: string): FormulaNode => {
    return pipe(
        tokenize,
        createLayers,
        parseTokenLayer
    )(expression);
};

export interface BoxScriptNode extends BoxNode {
	nucleus: BoxNode,
	sup?: BoxNode,
	sub?: BoxNode
};



import { lookUpUnicode } from "../../font-data/katex-font-util";
import { Style } from "../../style";
import { BoxNode, CharNode, FormulaNode, ScriptNode as FormulaScriptNode, TextNode } from '../../types';
import { layoutScriptInLimitPosition } from './limit-layout';
import { layoutScriptInNoLimitPosition } from './no-limit-layout';
import { isNodeChar, isNodeText } from "../../node-types";




const isNodeDisplayOperator = (style: Style, node: FormulaNode) : boolean => {
	return isNodeChar(node) && node.type === "op" && style.type === "D";
};
//the integral operator can only have sub- and superscripts in nolimit-position
const isDisplayOperatorLimitException = (node: CharNode) => lookUpUnicode(node.value) !== 8747 /*integral: ∫*/;
const isScriptLimitPosition = (style: Style, nucleus: FormulaNode) : boolean => {
	return (nucleus.style !== undefined && nucleus.style.fontFamily !== undefined && nucleus.style.fontFamily === "Size2") ||
		(isNodeDisplayOperator(style, nucleus) && !isDisplayOperatorLimitException(nucleus as CharNode)) || 
		isNodeText(nucleus) && (nucleus as TextNode).text === "lim";
};



export const layoutScript = (script: FormulaScriptNode) : BoxScriptNode => {
	const { nucleus } = script;
	const limitPosition = isScriptLimitPosition(script.style, nucleus);
	const layoutFunc = limitPosition ? layoutScriptInLimitPosition : layoutScriptInNoLimitPosition;
	return layoutFunc(script);
};
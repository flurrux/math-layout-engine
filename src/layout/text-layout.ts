import { sum, pipe, map } from 'ramda';
import { getMetricsObject } from '../font-data/katex-font-util';
import { createNodeStyle } from '../style';
import { Style, BoxNode, TextNode as FormulaTextNode } from '../types';

export interface BoxTextNode extends BoxNode {
	text: string
}

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205;

const getMetricsOfChar = (style: Style, char: string) => getMetricsObject(style.fontFamily, style.emphasis, char.charCodeAt(0));
const calculateTextWidth = (style: Style, text:  string) => pipe(
	Array.from, map((char: string) => getMetricsOfChar(style, char).width), sum
)(text);

export const layoutTextNode = (textNode: FormulaTextNode) : BoxTextNode => {
	const style = createNodeStyle(textNode, {
		fontFamily: "Main", 
		emphasis: "Regular",
	});
	const dimensions = {
		width: calculateTextWidth(style, textNode.text) * style.fontSize,
		yMax: maxTextualHeight * style.fontSize,
		yMin: maxTextualDepth * style.fontSize,
	};
	return {
		type: "text", text: textNode.text,
		dimensions, style
	};
};
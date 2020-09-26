import { sum, pipe, map, multiply } from 'ramda';
import { getMetricsObject } from '../font-data/katex-font-util';
import { createNodeStyle } from '../style';
import { BoxNode, TextNode as FormulaTextNode } from '../types';
import { Style } from '../style';
import { validateProperties, validateCharInFont } from './error';
import { nodeType } from '../node-types';

export interface BoxTextNode extends BoxNode {
	type: "text",
	srcType: "ord" | "op",
	text: string,
	style: Style
};

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205;

const getMetricsOfChar = (style: Style, char: string) => getMetricsObject(style.fontFamily, style.emphasis, char.charCodeAt(0));
const calculateTextWidth = (style: Style, text:  string) => pipe(
	Array.from, map((char: string) => getMetricsOfChar(style, char).width), sum
)(text);

export const layoutTextNode = (textNode: FormulaTextNode) : BoxTextNode => {
	validateProperties({
		text: "string"
	})(textNode);
	
	const { text } = textNode;
	const style = createNodeStyle(textNode, {
		type: textNode.style.type,
		fontFamily: "Main", 
		emphasis: "Regular",
	});
	Array.from(text).forEach(char => validateCharInFont(style, char));
	const { fontSize } = style;
	const dimensions = map(multiply(fontSize))({
		width: calculateTextWidth(style, text),
		yMax: maxTextualHeight,
		yMin: maxTextualDepth,
	});
	return {
		type: "text", 
		srcType: textNode.type,
		text, dimensions, style
	};
};
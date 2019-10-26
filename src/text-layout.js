import { sum, pipe, map } from 'ramda';
import { getMetricsObject } from './font-data/katex-font-util';
import { createNodeStyle } from './style';

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205;

const getMetricsOfChar = (style, char) => getMetricsObject(style.fontFamily, style.emphasis, char.charCodeAt(0));
const calculateTextWidth = (style, text) => pipe(
	Array.from,
	map(char => getMetricsOfChar(style, char).width),
	sum
)(text);

export const layoutTextNode = (textNode) => {
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
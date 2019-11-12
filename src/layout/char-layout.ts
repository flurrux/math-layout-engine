import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, 
	getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util";
import { map, multiply } from 'ramda';
import { createNodeStyle } from "../style";

import { Metrics } from '../font-data/katex-font-util';
import { Dimensions, BoundingBox, CharNode as FormulaCharNode, BoxNode } from '../types';
import { Style } from '../style';

export interface BoxCharNode extends BoxNode {
	type: string,
	char: string,
	unicode: number,
	style: Style,
	dimensions: Dimensions,
	bbox: BoundingBox
};

const getMetricsOfCharNode = (charNode: BoxCharNode) : Metrics => getMetricsObject(charNode.style.fontFamily, charNode.style.emphasis, charNode.unicode);
const getDimensionsOfCharNode = (style: Style, node: FormulaCharNode) : Dimensions => {
	const fontData = lookUpGlyphByCharOrAlias(node.value);
	const metrics: Metrics = getMetricsObject(fontData.fontFamily, getDefaultEmphasis(fontData.fontFamily), fontData.unicode);
	return map(multiply(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
export const layoutCharNode = (node: FormulaCharNode) : BoxCharNode => {
	if (typeof(node.value) !== "string"){
		throw 'the value-property of this CharNode is either missing or not a string';
	}
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const emphasis : string = getDefaultEmphasis(fontFamily);
	const style = createNodeStyle(node, { fontFamily, emphasis });
	return {
		type: "char", unicode, style,
		char: String.fromCharCode(unicode), 
		dimensions: getDimensionsOfCharNode(style, node),
		bbox: map(multiply(style.fontSize))(lookUpBoundingBox(fontFamily, unicode, style.emphasis))
	};
};
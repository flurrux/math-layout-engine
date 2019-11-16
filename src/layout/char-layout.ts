import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, 
	getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util";
import { map, multiply } from 'ramda';
import { createNodeStyle } from "../style";

import { Metrics } from '../font-data/katex-font-util';
import { Dimensions, BoundingBox, CharNode as FormulaCharNode, BoxNode } from '../types';
import { Style } from '../style';
import { validateProperties } from "./error";

export interface BoxCharNode extends BoxNode {
	type: string,
	char: string,
	unicode: number,
	style: Style,
	dimensions: Dimensions,
	bbox: BoundingBox
};

const getMetricsOfCharNode = (charNode: BoxCharNode) : Metrics => getMetricsObject(charNode.style.fontFamily, charNode.style.emphasis, charNode.unicode);
const getDimensionsOfCharNode = (style: Style, node: FormulaCharNode, unicode: number) : Dimensions => {
	const metrics: Metrics = getMetricsObject(style.fontFamily, style.emphasis, unicode);
	return map(multiply(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
export const layoutCharNode = (node: FormulaCharNode) : BoxCharNode => {
	validateProperties({
		value: "string"
	})(node);
	
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const emphasis : string = getDefaultEmphasis(fontFamily);
	const style = createNodeStyle(node, { fontFamily, emphasis });
	return {
		type: "char", unicode, style,
		char: String.fromCharCode(unicode), 
		dimensions: getDimensionsOfCharNode(style, node, unicode),
		bbox: map(multiply(style.fontSize))(lookUpBoundingBox(fontFamily, unicode, style.emphasis))
	};
};
import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, 
	getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util";
import { map, multiply } from 'ramda';
import { createNodeStyle } from "../style";

import { Metrics } from '../font-data/katex-font-util';
import { Style, Dimensions, BoundingBox } from '../types';

export interface CharNode {
	type: string,
	char: string,
	unicode: number,
	style: Style,
	dimensions: Dimensions,
	bbox: BoundingBox
};

const getMetricsOfCharNode = (charNode: CharNode) => getMetricsObject(charNode.style.fontFamily, charNode.style.emphasis, charNode.unicode);

const getDimensionsOfCharNode = (style: Style, node: any) : Dimensions => {
	const fontData: any = lookUpGlyphByCharOrAlias(node.value);
	const metrics: Metrics = getMetricsObject(fontData.fontFamily, getDefaultEmphasis(fontData.fontFamily), fontData.unicode);
	return map(multiply(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
export const layoutCharNode = (node: any) : CharNode => {
	//todo: use fontFamily if it's defined in style
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const emphasis : string = getDefaultEmphasis(fontFamily);

	const char: string = String.fromCharCode(unicode);
	const style: Style = createNodeStyle(node, { fontFamily, emphasis });
	return {
		type: "char", char, unicode, style,
		dimensions: getDimensionsOfCharNode(style, node),
		bbox: map(multiply(style.fontSize))(lookUpBoundingBox(fontFamily, unicode, style.emphasis))
	};
};
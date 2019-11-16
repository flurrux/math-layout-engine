import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, 
	getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util";
import { map, multiply, assoc, pipe } from 'ramda';
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

const getDimensionsOfCharNode = (style: Style, node: FormulaCharNode, unicode: number) : Dimensions => {
	const metrics: Metrics = getMetricsObject(style.fontFamily, style.emphasis, unicode);
	return map(multiply(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};

const handleOperatorStyle = (node: FormulaCharNode) => ((style: Style) : Style => {
	if (node.type !== "op" || !["Size1", "Size2"].includes(style.fontFamily)){
		return style;
	}
	const fontFamily = style.type === "D" ? "Size2" : "Size1";
	return assoc("fontFamily", fontFamily, style);
});

export const layoutCharNode = (node: FormulaCharNode) : BoxCharNode => {
	validateProperties({
		value: "string"
	})(node);
	
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const emphasis : string = getDefaultEmphasis(fontFamily);
	const implicitStyle = pipe(handleOperatorStyle(node))({ fontFamily, emphasis }) as Style;
	const style = createNodeStyle(node, implicitStyle);
	return {
		type: "char", unicode, style,
		char: String.fromCharCode(unicode), 
		dimensions: getDimensionsOfCharNode(style, node, unicode),
		bbox: map(multiply(style.fontSize))(lookUpBoundingBox(fontFamily, unicode, style.emphasis))
	};
};
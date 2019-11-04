import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, 
	getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util";
import { map, multiply } from 'ramda';
import { createNodeStyle } from "../style";

interface Style {
	fontSize: number,
	emphasis: string
};

interface Dimensions {
	width: number, 
	yMin: number,
	yMax: number
};

interface Metrics {
	width: number,
	height: number,
	depth: number,
	italicCorrection: number,
	skew: number
};

interface BoundingBox {
	xMin: number,
	yMin: number,
	xMax: number,
	yMax: number
};

interface CharNode {
	type: string,
	char: string,
	unicode: number,
	style: object,
	dimensions: Dimensions,
	bbox: BoundingBox
};

const getDimensionsOfCharNode = (style: any, node: any) : Dimensions => {
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
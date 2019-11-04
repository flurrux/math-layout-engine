import { 
	lookUpGlyphByCharOrAlias, getMetricsObject, getDefaultEmphasis, lookUpBoundingBox 
} from "../font-data/katex-font-util.js";
import { scaleMap } from "../util.js";
import { map } from 'ramda';
import { createNodeStyle } from "../style.js";

const getDimensionsOfCharNode = (style, node) => {
	const fontData = lookUpGlyphByCharOrAlias(node.value);
	const metrics = getMetricsObject(fontData.fontFamily, getDefaultEmphasis(fontData.fontFamily), fontData.unicode);
	return map(scaleMap(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
export const layoutCharNode = (node) => {
	//todo: use fontFamily if it's defined in style
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const emphasis = getDefaultEmphasis(fontFamily);

	const char = String.fromCharCode(unicode);
	const style = createNodeStyle(node, { fontFamily, emphasis });
	return {
		type: "char", char, unicode, style,
		dimensions: getDimensionsOfCharNode(style, node),
		bbox: map(scaleMap(style.fontSize))(lookUpBoundingBox(fontFamily, unicode, style.emphasis))
	};
};
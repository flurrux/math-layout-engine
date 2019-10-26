import { lookUpGlyphByCharOrAlias, getMetricsObject, getDefaultEmphasis } from "./font-data/katex-font-util";

const getDimensionsOfCharNode = (style, node) => {
	const fontData = lookUpGlyphByCharOrAlias(node.value);
	const metrics = getMetricsObject(fontData.fontFamily, getDefaultEmphasis(fontData.fontFamily), fontData.unicode);
	return R.map(scaleMap(style.fontSize))({
		width: metrics.width,
		yMin: -metrics.depth,
		yMax: metrics.height
	});
};
export const layoutCharNode = (style, node) => {
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	const char = String.fromCharCode(unicode);
	return {
		type: "char", char, unicode,
		style: {
			emphasis: getDefaultEmphasis(fontFamily),
			...style, fontFamily
		},
		dimensions: getDimensionsOfCharNode(style, node)
	};
};
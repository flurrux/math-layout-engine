
import { isNodeChar, isNodeText } from "./node-types";


const fontFamilyToTargetY = {
	Main: { supY: 0.42, subY: -0.2 },
    Math: { supY: 0.42, subY: -0.2 }, 
    Size1: { supY: 0.5, subY: -0.25 },
    Size2: { supY: 0.7, subY: -0.4 }
};
const targetYOverride = [
    { fontFamily: "Size2", unicode: 8747, supY: 1.15, subY: -0.85 }
];
const getOverridenTargetY = (fontFamily, unicode) => targetYOverride.find(entry => {
    return entry.fontFamily === fontFamily && entry.unicode === unicode
});
const getTargetYOfGlyphNucleus = (fontFamily, unicode) => {
    return getOverridenTargetY(fontFamily, unicode) || fontFamilyToTargetY[fontFamily] || { supY: 0.42, subY: -0.2 };
};


import { smallerStyle, smallestStyle, withStyle } from "./style";
import { pickList, scaleMap, isDefined, identity } from "./util";
import { layoutNode, calcBoundingDimensions, withPosition, getAxisAlignment, calcCentering, boxBottom, getAxisHeight } from "./layout";
import { lookUpUnicode, lookUpGlyphByCharOrAlias, getMetricsObject, getMetricsOfCharNode } from "./font-data/katex-font-util";
import { pipe, filter, map } from 'ramda';

const getSubOrSupStyle = (scriptStyle, subOrSupNode) => {
	return subOrSupNode.type === "fraction" ? smallestStyle(scriptStyle) : smallerStyle(scriptStyle);
};
const getSupSubTargetYNoLimits = (style, script, nucleusDim) => {
	const { nucleus } = script;
	const { fontSize } = style;
	if (isNodeChar(nucleus)){
		const nucleusGlyphData = lookUpGlyphByCharOrAlias(nucleus.value);
		const targetYs = getTargetYOfGlyphNucleus(nucleusGlyphData.fontFamily, nucleusGlyphData.unicode);
		return [
			targetYs.supY * fontSize,
			targetYs.subY * fontSize
		]
	}
	else if (isNodeText(nucleus)){
		const fontFamily = style.fontFamily || "Main";
		return pickList(["supY", "subY"], fontFamilyToTargetY[fontFamily]).map(scaleMap(fontSize));
	}
	else {
		return [
			nucleusDim.yMax,
			nucleusDim.yMin - fontSize * 0.06
		]
	}
};
const getCrampedTargetYOffset = (style) => style.cramped ? (-style.fontSize * 0.1) : 0;



const layoutSuperScriptInLimitPosition = (parentStyle, supStyle, nucleusDimensions, sup) => {
	const supLayouted = pipe(withStyle(supStyle), layoutNode)(sup);
	const supDim = supLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position = [
		calcCentering(supDim.width, nucleusDimensions.width),
		nucleusDimensions.yMin - supDim.yMax - spacing
	];
	return withPosition(supLayouted, position);
};
const layoutSubScriptInLimitPosition = (parentStyle, subStyle, nucleusDimensions, sub) => {
	const subLayouted = pipe(withStyle(subStyle), layoutNode)(sub);
	const subDim = subLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position = [
		calcCentering(subDim.width, nucleusDimensions.width),
		nucleusDimensions.yMin - subDim.yMax - spacing
	];
	return withPosition(subLayouted, position);
};
const translateNode = (translation) => (node => identity({ 
	...node, 
	position: [
		node.position[0] + translation[0],
		node.position[1] + translation[1]
	] 
}));
const min = (arr) => Math.min(...arr);
const alignBoxLeftToZero = (scriptLayouted) => {
	const horizontalShift = -pipe(Object.values, map(obj => obj.position[0]), min)(scriptLayouted);
	return map(translateNode([horizontalShift, 0]))(scriptLayouted);
};
const layoutScriptLimitPosition = (script) => {
	const { style } = script;
	
	const nucleusLayouted = pipe(withStyle(style), layoutNode)(script.nucleus);
	const nucleusDim = nucleusLayouted.dimensions;

	const scriptStyle = smallerStyle(style);
	let scriptLayouted = pipe(filter(isDefined), alignBoxLeftToZero)({
		nucleus: withPosition(nucleusLayouted, [0, 0]),
		sup: script.sup ? layoutSuperScriptInLimitPosition(style, scriptStyle, nucleusDim, script.sup) : undefined,
		sub: script.sub ? layoutSubScriptInLimitPosition(style, scriptStyle, nucleusDim, script.sub) : undefined,
	});
	
	const dimensions = calcBoundingDimensions(Object.values(scriptLayouted));
	return {
		type: "script",
		style, dimensions,
		...scriptLayouted
	};
};
const layoutScriptNoLimitPosition = (script) => {
	const { style } = script;
	const { nucleus, sup, sub } = script;

	const nucleusLayouted = withPosition(layoutNode(withStyle(style)(nucleus)), [0, 0]);
	const { fontSize } = style;

	const scriptLayouted = {
		nucleus: nucleusLayouted
	};

	const nucleusRight = nucleusLayouted.dimensions.width;
	const nucleusMetrics = isNodeChar(nucleus) ? getMetricsOfCharNode(nucleusLayouted) : null;

	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	if (sup) {
		const supStyle = getSubOrSupStyle(style, sup);
		const supLayouted = pipe(withStyle(supStyle), layoutNode)(sup);
		const targetY = (function () {
			let y = supSubTargetY[0] - getAxisAlignment(style, sup) + getCrampedTargetYOffset(style);

			//if bottom of superscript is too close to baseline, shift it up
			const minBottomToBaselineGap = fontSize * 0.3;
			const bottomToSupBaseline = (y + supLayouted.dimensions.yMin);
			y += Math.max(0, -(bottomToSupBaseline - minBottomToBaselineGap));
			return y;
		})();
		//add a small spacing
		const supX = nucleusMetrics ? (nucleusMetrics.width + nucleusMetrics.italicCorrection + 0.08) * fontSize : nucleusRight;
		supLayouted.position = [supX, targetY];
		scriptLayouted.sup = supLayouted;
	}

	if (sub) {
		const subStyle = getSubOrSupStyle(style, sub);
		const subLayouted = pipe(withStyle(subStyle), layoutNode)(sub);
		const targetY = (function () {
			let y = supSubTargetY[1];

			if (sup) y -= fontSize * 0.08;

			//if top of subscript is too close to the axis, shift it down
			const nucleusAxisY = getAxisHeight(style);
			const minTopToAxisGap = -fontSize * 0.1;
			const topToAxisGap = nucleusAxisY - (y + subLayouted.dimensions.yMax);
			y += Math.min(0, topToAxisGap - minTopToAxisGap);

			return y;
		})();

		const subX = isNodeChar(nucleus) ? (fontSize * getMetricsObject(nucleusLayouted.style.fontFamily, nucleusLayouted.style.emphasis, nucleusLayouted.unicode).width) : nucleusRight;
		subLayouted.position = [subX, targetY];
		scriptLayouted.sub = subLayouted;
	}

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script",
		...scriptLayouted, style, dimensions
	};
};
const isScriptLimitPosition = (style, nucleus) => (
	(
		isNodeChar(nucleus) && nucleus.type === "op" && 
		style.type === "D" && lookUpUnicode(nucleus.value) !== 8747
	) || 
	isNodeText(nucleus) && nucleus.text === "lim"
);
export const layoutScript = (script) => {
	const { nucleus } = script;
	const limitPosition = isScriptLimitPosition(script.style, nucleus);
	if (limitPosition) {
		script = {
			...script,
			nucleus: {
				...script.nucleus,
				fontFamily: "Size2"
			}
		};
	}
	return limitPosition ? layoutScriptLimitPosition(script) : layoutScriptNoLimitPosition(script);
};
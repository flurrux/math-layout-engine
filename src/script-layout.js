
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


import { smallerStyle, smallestStyle } from "./style";
import { pickList, scaleMap, isDefined } from "./util";
import { layoutNode, calcBoundingDimensions, withPosition, getAxisAlignment } from "./layout";
import { lookUpUnicode, lookUpGlyphByCharOrAlias } from "./font-data/katex-font-util";
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
const layoutScriptLimitPosition = (style, script) => {
	const scriptStyle = smallerStyle(style);
	const styles = { nucleus: style, sup: scriptStyle, sub: scriptStyle };
	const scriptLayouted = ["nucleus", "sup", "sub"].reduce((obj, key) => {
		return {
			...obj,
			...(script[key] !== undefined ? { 
				[key]: layoutNode(styles[key], 
				script[key]) 
			} : {})
		};
	}, {});

	const nucleusDim = scriptLayouted.nucleus.dimensions;
	const positions = {
		nucleus: [0, 0],
		sup: scriptLayouted.sup ? [
			calcCentering(scriptLayouted.sup.dimensions.width, nucleusDim.width),
			nucleusDim.yMax - scriptLayouted.sup.dimensions.yMin + style.fontSize * 0.2
		] : undefined,
		sub: scriptLayouted.sub ? [
			calcCentering(scriptLayouted.sub.dimensions.width, nucleusDim.width),
			nucleusDim.yMin - scriptLayouted.sub.dimensions.yMax - style.fontSize * 0.2
		] : undefined
	};

	const layoutedScriptWithPositions = Reflect.ownKeys(scriptLayouted).reduce((obj, key) => {
		return {
			...obj,
			[key]: {
				...scriptLayouted[key],
				position: positions[key]
			}
		}
	}, {});
	const dimensions = calcBoundingDimensions(Object.values(layoutedScriptWithPositions));
	return {
		type: "script",
		style, dimensions,
		...layoutedScriptWithPositions
	};
};
const layoutScriptNoLimitPosition = (style, script) => {
	const { nucleus, sup, sub } = script;

	const nucleusLayouted = withPosition(layoutNode(style, nucleus), [0, 0]);
	const { fontSize } = style;

	const scriptLayouted = {
		nucleus: nucleusLayouted
	};

	const nucleusRight = nucleusLayouted.dimensions.width;

	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	if (sup) {
		const supStyle = getSubOrSupStyle(style, sup);
		const supLayouted = layoutNode(supStyle, sup);
		const targetY = (function () {
			let y = supSubTargetY[0] - getAxisAlignment(style, sup);

			//if bottom of superscript is too close to baseline, shift it up
			const minBottomToBaselineGap = fontSize * 0.3;
			const bottomToSupBaseline = (y + supLayouted.dimensions.yMin);
			y += Math.max(0, -(bottomToSupBaseline - minBottomToBaselineGap));
			return y;
		})();
		//add a small spacing
		const supX = nucleusRight + (fontSize * 0.08);
		supLayouted.position = [supX, targetY];
		scriptLayouted.sup = supLayouted;
	}

	if (sub) {
		const subStyle = getSubOrSupStyle(style, sub);
		const subLayouted = layoutNode(subStyle, sub);
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

		const subX = isNodeChar(nucleus) ? (fontSize * getGlyphMetrics(nucleus).width) : nucleusRight;
		subLayouted.position = [subX, targetY];
		scriptLayouted.sub = subLayouted;
	}

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script",
		...scriptLayouted, style, dimensions
	};
};
const isScriptLimitPosition = (nucleus) => (
	(
		isNodeChar(nucleus) && nucleus.type === "op" && 
		style.type === "D" && lookUpUnicode(nucleus.value) !== 8747
	) || 
	isNodeText(nucleus) && nucleus.text === "lim"
);
export const layoutScript = (style, script) => {
	const { nucleus } = script;
	const limitPosition = isScriptLimitPosition(nucleus);
	if (limitPosition) {
		script = {
			...script,
			nucleus: {
				...script.nucleus,
				fontFamily: "Size2"
			}
		};
	}
	return limitPosition ? layoutScriptLimitPosition(style, script) : layoutScriptNoLimitPosition(style, script);
};
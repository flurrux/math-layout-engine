




interface TargetYPair {
	supY: number, 
	subY: number
}
const fontFamilyToTargetY : { [key: string]: TargetYPair } = {
	Main: { supY: 0.42, subY: -0.2 },
    Math: { supY: 0.42, subY: -0.2 }, 
    Size1: { supY: 0.5, subY: -0.25 },
    Size2: { supY: 0.7, subY: -0.4 }
};
const targetYOverride: { fontFamily: string, unicode: number, supY: number, subY: number }[] = [
    { fontFamily: "Size2", unicode: 8747, supY: 1.15, subY: -0.85 }
];
const getOverridenTargetY = (fontFamily: string, unicode: number) => targetYOverride.find(entry => {
    return entry.fontFamily === fontFamily && entry.unicode === unicode
});
const getTargetYOfGlyphNucleus = (fontFamily: string, unicode: number) : TargetYPair => {
    return getOverridenTargetY(fontFamily, unicode) || fontFamilyToTargetY[fontFamily] || { supY: 0.42, subY: -0.2 };
};







import { add, map, multiply, pick, pipe } from 'ramda';
import { lookUpGlyphByCharOrAlias } from "../../font-data/katex-font-util";
import { isNodeChar, isNodeText } from "../../node-types";
import { smallerStyle, smallestStyle, Style } from "../../style";
import { BoxNode, CharNode, Dimensions, FormulaNode, ScriptNode as FormulaScriptNode } from '../../types';
import { getMetricsOfCharNode, isDefined, pickList } from "../../util/util";
import { BoxCharNode } from '../char-layout';
import { validateProperties } from "../error";
import { layoutWithStyle, layoutByMap } from "../layout";
import { boxRight, calcBoundingDimensions, setPosition } from '../layout-util';
import { BoxScriptNode } from './script-layout';






const getSubOrSupStyle = (scriptStyle: Style, subOrSupNode: FormulaNode) : Style => {
	return subOrSupNode.type === "fraction" ? smallestStyle(scriptStyle) : smallerStyle(scriptStyle);
};

const getSupSubTargetYNoLimits = (style: Style, script: FormulaScriptNode, nucleusDim: Dimensions) : [number, number] => {
	const { nucleus } = script;
	const { fontSize } = style;
	if (isNodeChar(nucleus)){
		const nucleusGlyphData = lookUpGlyphByCharOrAlias((nucleus as CharNode).value);
		const targetYs = getTargetYOfGlyphNucleus(nucleusGlyphData.fontFamily, nucleusGlyphData.unicode);
		return map(multiply(fontSize))([ targetYs.supY, targetYs.subY ])
	}
	else if (isNodeText(nucleus)){
		const fontFamily = style.fontFamily || "Main";
		return (pickList(["supY", "subY"], fontFamilyToTargetY[fontFamily]) as [number, number]).map(multiply(fontSize)) as [number, number];
	}
	else {
		return [
			nucleusDim.yMax,
			nucleusDim.yMin - fontSize * 0.06
		]
	}
};
const getCrampedTargetYOffset = (style: Style) : number => style.cramped ? (-style.fontSize * 0.1) : 0;


//if bottom of superscript is too close to baseline, shift it up
const correctSupNoLimPosition = (mainFontSize: number, supLayouted: BoxNode) => ((positionY: number) => {
	const minBottomToBaselineGap = mainFontSize * 0.3;
	const bottomToSupBaseline = positionY + supLayouted.dimensions.yMin;
	return positionY + Math.max(0, -bottomToSupBaseline + minBottomToBaselineGap);
});
const getPositionXOfSupAtCharNucleus = (nucleus: BoxCharNode, mainStyle: Style) => {
	const metrics = getMetricsOfCharNode(nucleus);
	return (metrics.width + metrics.italicCorrection) * mainStyle.fontSize;
};
const layoutSupNoLim = (mainStyle: Style, nucleusLayouted: BoxNode, targetY: number) => ((sup: FormulaNode) : BoxNode => {
	const supStyle = getSubOrSupStyle(mainStyle, sup);
	const supLayouted: BoxNode = layoutWithStyle(supStyle)(sup);
	
	const positionY = pipe(
		add(getCrampedTargetYOffset(mainStyle)), 
		correctSupNoLimPosition(mainStyle.fontSize, supLayouted)
	)(targetY);

	//add a small spacing
	const mainFontSize = mainStyle.fontSize;
	const horizontalSpacing = 0.08 * mainFontSize;
	const positionX = (nucleusLayouted.type === "char" ? 
		getPositionXOfSupAtCharNucleus(nucleusLayouted as BoxCharNode, mainStyle) : 
		nucleusLayouted.dimensions.width
	) + horizontalSpacing;

	return setPosition([positionX, positionY])(supLayouted);
});


//if the top of the subscript is overflowing too much above the baseline, shift it down
const correctSubNoLimPosition = (mainStyle: Style, subLayouted: BoxNode) => ((positionY: number) : number => {
	const maxTop = mainStyle.fontSize * 0.25;
	const top = positionY + subLayouted.dimensions.yMax;
	return positionY + Math.min(0, maxTop - top);
});
const layoutSubNoLim = (mainStyle: Style, nucleusLayouted: BoxNode, targetY: number, hasSup: boolean) => ((sub: FormulaNode) : BoxNode => {
	const subLayouted = layoutWithStyle(getSubOrSupStyle(mainStyle, sub))(sub);
	return setPosition([
		pipe(
			boxRight,
			add(subLayouted.type === "char" ? 
				-(subLayouted as BoxCharNode).bbox.xMin + 0.02 * mainStyle.fontSize : 0)
		)(nucleusLayouted),
		pipe(
			add(hasSup ? mainStyle.fontSize * -0.08 : 0), 
			correctSubNoLimPosition(mainStyle, subLayouted)
		)(targetY)
	])(subLayouted);
});

export const layoutScriptInNoLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	validateProperties({
		nucleus: "object"
	})(script);

	const { style } = script;

	const nucleusLayouted: BoxNode = pipe(layoutWithStyle(style), setPosition([0, 0]))(script.nucleus);
	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	const scriptLayouted = {
		nucleus: nucleusLayouted,
		...pipe(
			pick(["sup", "sub"]), 
			layoutByMap({
				sup: layoutSupNoLim(style, nucleusLayouted, supSubTargetY[0]),
				sub: layoutSubNoLim(style, nucleusLayouted, supSubTargetY[1], script.sup !== undefined)
			})
		)(script)
	};

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script", style, dimensions,
		...scriptLayouted
	};
};
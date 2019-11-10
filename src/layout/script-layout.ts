
import { isNodeChar, isNodeText } from "../node-types";
 
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

export interface BoxScriptNode extends BoxNode {
	nucleus: BoxNode,
	sup?: BoxNode,
	sub?: BoxNode
};

import { ScriptNode as FormulaScriptNode, BoxNode, FormulaNode, CharNode, TextNode, Dimensions, Vector2 } from '../types';
import { smallerStyle, smallestStyle, withStyle, Style } from "../style";
import { pickList, isDefined, min } from "../util";
import { layoutNode, layoutWithStyle } from "./layout";
import { 
	center, setPosition, calcBoundingDimensions, getAxisHeight, alignToYAxis
} from './layout-util';

import { lookUpUnicode, lookUpGlyphByCharOrAlias, getMetricsObject, Metrics } from "../font-data/katex-font-util";
import { pipe, filter, map, multiply, identity } from 'ramda';
import { BoxCharNode } from './char-layout';


const getMetricsOfCharNode = (node: BoxCharNode) => getMetricsObject(node.style.fontFamily, node.style.emphasis, node.unicode);

const getSubOrSupStyle = (scriptStyle: Style, subOrSupNode: FormulaNode) : Style => {
	return subOrSupNode.type === "fraction" ? smallestStyle(scriptStyle) : smallerStyle(scriptStyle);
};
const getSupSubTargetYNoLimits = (style: Style, script: FormulaScriptNode, nucleusDim: Dimensions) : [number, number] => {
	const { nucleus } = script;
	const { fontSize } = style;
	if (isNodeChar(nucleus)){
		const nucleusGlyphData = lookUpGlyphByCharOrAlias((nucleus as CharNode).value);
		const targetYs = getTargetYOfGlyphNucleus(nucleusGlyphData.fontFamily, nucleusGlyphData.unicode);
		return [
			targetYs.supY * fontSize,
			targetYs.subY * fontSize
		]
	}
	else if (isNodeText(nucleus)){
		const fontFamily = style.fontFamily || "Main";
		return pickList(["supY", "subY"], fontFamilyToTargetY[fontFamily]).map(multiply(fontSize));
	}
	else {
		return [
			nucleusDim.yMax,
			nucleusDim.yMin - fontSize * 0.06
		]
	}
};
const getCrampedTargetYOffset = (style: Style) : number => style.cramped ? (-style.fontSize * 0.1) : 0;

const valuesInObject = (obj: object) : any[] => (Object as any).values(obj);


//limit position ###

const layoutSuperScriptInLimitPosition = (parentStyle: Style, supStyle: Style, nucleusDimensions: Dimensions, sup: FormulaNode) : BoxNode => {
	const supLayouted : BoxNode = pipe(withStyle(supStyle), layoutNode)(sup);
	const supDim = supLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(supDim.width, nucleusDimensions.width),
		nucleusDimensions.yMax - supDim.yMin + spacing
	];
	return setPosition(position)(supLayouted);
};
const layoutSubScriptInLimitPosition = (parentStyle: Style, subStyle: Style, nucleusDimensions: Dimensions, sub: FormulaNode) : BoxNode => {
	const subLayouted = pipe(withStyle(subStyle), layoutNode)(sub);
	const subDim = subLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(subDim.width, nucleusDimensions.width),
		nucleusDimensions.yMin - subDim.yMax - spacing
	];
	return setPosition(position)(subLayouted);
};

const layoutScriptLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	const { style } = script;
	
	const nucleusLayouted : BoxNode = pipe(withStyle(style), layoutNode)(script.nucleus);
	const nucleusDim = nucleusLayouted.dimensions;

	const scriptStyle = smallerStyle(style);
	let scriptLayouted : { nucleus: BoxNode, sup?: BoxNode, sub?: BoxNode } = pipe(filter(isDefined), alignToYAxis)({
		nucleus: setPosition([0, 0])(nucleusLayouted),
		sup: script.sup ? layoutSuperScriptInLimitPosition(style, scriptStyle, nucleusDim, script.sup) : undefined,
		sub: script.sub ? layoutSubScriptInLimitPosition(style, scriptStyle, nucleusDim, script.sub) : undefined,
	});
	
	const dimensions = calcBoundingDimensions(valuesInObject(scriptLayouted));
	return {
		type: "script",
		style, dimensions,
		...scriptLayouted
	};
};



//nolimit position ###

const layoutScriptNoLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	const { style } = script;
	const { nucleus, sup, sub } = script;

	const nucleusLayouted: BoxNode = pipe(layoutWithStyle(style), setPosition([0, 0]))(nucleus);
	const { fontSize } = style;

	const scriptLayouted : { nucleus: BoxNode, sup?: BoxNode, sub?: BoxNode } = {
		nucleus: nucleusLayouted
	};

	const nucleusRight = nucleusLayouted.dimensions.width;
	const nucleusMetrics : Metrics = isNodeChar(nucleus) ? getMetricsOfCharNode(nucleusLayouted as BoxCharNode) : null;

	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	if (sup) {
		const supStyle = getSubOrSupStyle(style, sup);
		const supLayouted: BoxNode = pipe(withStyle(supStyle), layoutNode)(sup);
		const targetY = (() => {
			let y = supSubTargetY[0] + getCrampedTargetYOffset(style);

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
		const targetY = (() => {
			let y = supSubTargetY[1];

			if (sup) y -= fontSize * 0.08;

			//if top of subscript is too close to the axis, shift it down
			const nucleusAxisY = getAxisHeight(style);
			const minTopToAxisGap = -fontSize * 0.1;
			const topToAxisGap = nucleusAxisY - (y + subLayouted.dimensions.yMax);
			y += Math.min(0, topToAxisGap - minTopToAxisGap);

			return y;
		})();

		const subX = isNodeChar(nucleus) ? (fontSize * getMetricsOfCharNode(nucleus as BoxCharNode).width) : nucleusRight;
		subLayouted.position = [subX, targetY];
		scriptLayouted.sub = subLayouted;
	}

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script",
		...scriptLayouted, style, dimensions
	};
};
const isScriptLimitPosition = (style: Style, nucleus: FormulaNode) : boolean => (
	(
		isNodeChar(nucleus) && nucleus.type === "op" && 
		style.type === "D" && 
		lookUpUnicode((nucleus as CharNode).value) !== 8747 //integral: ∫
	) || 
	isNodeText(nucleus) && (nucleus as TextNode).text === "lim"
);


export const layoutScript = (script: FormulaScriptNode) : BoxScriptNode => {
	const { nucleus } = script;
	const limitPosition = isScriptLimitPosition(script.style, nucleus);
	if (limitPosition) {
		script = {
			...script,
			nucleus: {
				...script.nucleus,
				style: {
					...(script.nucleus.style || {}),
					fontFamily: "Size2"
				}
			}
		};
	}
	return limitPosition ? layoutScriptLimitPosition(script) : layoutScriptNoLimitPosition(script);
};
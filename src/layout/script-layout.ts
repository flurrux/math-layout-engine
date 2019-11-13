
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

import { ScriptNode as FormulaScriptNode, BoxNode, FormulaNode, CharNode, TextNode, Dimensions, Vector2, ScriptNode } from '../types';
import { smallerStyle, smallestStyle, withStyle, Style } from "../style";
import { pickList, isDefined, min, getMetricsOfCharNode } from "../util/util";
import { layoutNode, layoutWithStyle } from "./layout";
import { 
	center, setPosition, calcBoundingDimensions, getAxisHeight, alignToYAxis, boxRight
} from './layout-util';

import { lookUpUnicode, lookUpGlyphByCharOrAlias } from "../font-data/katex-font-util";
import { pipe, filter, map, multiply, identity, pick, add } from 'ramda';
import { BoxCharNode } from './char-layout';
import { validateProperties } from "./error";


//useful function for layouting optional nodes
//supply a map with layout-functions for all possible nodes and get back 
//the layouted nodes that actually exist
interface BoxNodeObject {
	[key: string]: BoxNode
};
interface FormulaNodeObject {
	[key: string]: FormulaNode
}
type LayoutFunction = (node: FormulaNode) => BoxNode;
const layoutByMap = (layoutMap: { [key: string]: LayoutFunction }) => ((inputMap: FormulaNodeObject) : BoxNodeObject => {
	const layouted : BoxNodeObject = {};
	const keys: string[] = Reflect.ownKeys(inputMap) as string[];
	for (const key of keys){
		layouted[key] = layoutMap[key](inputMap[key]);
	}
	return layouted;
});
const valuesInObject = (obj: object) : any[] => (Object as any).values(obj);





//limit position ###

const layoutSupLim = (parentStyle: Style, supStyle: Style, nucleusDimensions: Dimensions) => ((sup: FormulaNode) : BoxNode => {
	const supLayouted : BoxNode = pipe(withStyle(supStyle), layoutNode)(sup);
	const supDim = supLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(supDim.width, nucleusDimensions.width),
		nucleusDimensions.yMax - supDim.yMin + spacing
	];
	return setPosition(position)(supLayouted);
});
const layoutSubLim = (parentStyle: Style, subStyle: Style, nucleusDimensions: Dimensions) => ((sub: FormulaNode) : BoxNode => {
	const subLayouted = pipe(withStyle(subStyle), layoutNode)(sub);
	const subDim = subLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(subDim.width, nucleusDimensions.width),
		nucleusDimensions.yMin - subDim.yMax - spacing
	];
	return setPosition(position)(subLayouted);
});

const layoutScriptLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	const { style } = script;
	
	const nucleusLayouted : BoxNode = pipe(withStyle(style), layoutNode)(script.nucleus);
	const nucleusDim = nucleusLayouted.dimensions;

	const scriptStyle = smallerStyle(style);
	const scriptLayouted = {
		nucleus: nucleusLayouted,
		...layoutByMap({
			sup: layoutSupLim(style, scriptStyle, nucleusDim),
			sub: layoutSubLim(style, scriptStyle, nucleusDim)
		})
	};
	
	const dimensions = calcBoundingDimensions(valuesInObject(scriptLayouted));
	return {
		type: "script",
		style, dimensions,
		...scriptLayouted
	};
};




//nolimit position ###

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
	const maxTop = mainStyle.fontSize * 0.15;
	const top = positionY + subLayouted.dimensions.yMax;
	return positionY + Math.min(0, maxTop - top);
});
const layoutSubNoLim = (mainStyle: Style, nucleusLayouted: BoxNode, targetY: number, hasSup: boolean) => ((sub: FormulaNode) : BoxNode => {
	const subLayouted = layoutWithStyle(getSubOrSupStyle(mainStyle, sub))(sub);
	return setPosition([
		boxRight(nucleusLayouted),
		pipe(
			add(hasSup ? mainStyle.fontSize * 0.08 : 0), 
			correctSubNoLimPosition(mainStyle, subLayouted)
		)(targetY)
	])(subLayouted);
});

const layoutScriptNoLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	validateProperties({
		nucleus: "object"
	})(script);

	const { style } = script;

	const nucleusLayouted: BoxNode = pipe(layoutWithStyle(style), setPosition([0, 0]))(script.nucleus);
	const supSubTargetY = getSupSubTargetYNoLimits(style, script, nucleusLayouted.dimensions);

	const scriptLayouted = {
		nucleus: nucleusLayouted,
		...pipe(pick(["sup, sub"], layoutByMap({
			sup: layoutSupNoLim(style, nucleusLayouted, supSubTargetY[0]),
			sub: layoutSubNoLim(style, nucleusLayouted, supSubTargetY[1], script.sup !== undefined)
		})))(script)
	};

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script", style, dimensions,
		...scriptLayouted
	};
};

const isNodeDisplayOperator = (style: Style, node: FormulaNode) : boolean => {
	return isNodeChar(node) && node.type === "op" && style.type === "D";
};
//the integral operator can only have sub- and superscripts in nolimit-position
const isDisplayOperatorLimitException = (node: CharNode) => lookUpUnicode(node.value) !== 8747 /*integral: ∫*/;
const isScriptLimitPosition = (style: Style, nucleus: FormulaNode) : boolean => {
	return (nucleus.style !== undefined && nucleus.style.fontFamily !== undefined && nucleus.style.fontFamily === "Size2") ||
		(isNodeDisplayOperator(style, nucleus) && !isDisplayOperatorLimitException(nucleus as CharNode)) || 
		isNodeText(nucleus) && (nucleus as TextNode).text === "lim";
};

const withLimitStyle = (scriptNode: ScriptNode) : ScriptNode => {
	return {
		...scriptNode,
		nucleus: {
			...scriptNode.nucleus,
			style: {
				...(scriptNode.nucleus.style || {}),
				fontFamily: "Size2"
			}
		}
	};
};
export const layoutScript = (script: FormulaScriptNode) : BoxScriptNode => {
	const { nucleus } = script;
	const limitPosition = isScriptLimitPosition(script.style, nucleus);
	if (limitPosition) script = withLimitStyle(script);
	const layoutFunc = limitPosition ? layoutScriptLimitPosition : layoutScriptNoLimitPosition;
	return layoutFunc(script);
};
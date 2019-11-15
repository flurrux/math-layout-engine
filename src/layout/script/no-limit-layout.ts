
import { add, map, multiply, pick, pipe, when, assocPath } from 'ramda';
import { lookUpGlyphByCharOrAlias } from "../../font-data/katex-font-util";
import { isNodeChar, isNodeText } from "../../node-types";
import { smallerStyle, smallestStyle, Style, isDisplayStyle } from "../../style";
import { BoxNode, CharNode, Dimensions, FormulaNode, ScriptNode as FormulaScriptNode } from '../../types';
import { getMetricsOfCharNode, isDefined, pickList } from "../../util/util";
import { BoxCharNode } from '../char-layout';
import { validateProperties } from "../error";
import { layoutWithStyle, layoutByMap } from "../layout";
import { boxRight, calcBoundingDimensions, setPosition, boxBottom, boxTop, moveBox } from '../layout-util';
import { BoxScriptNode } from './script-layout';




//parameters ###

const defaultRuleThickness = 0.04;
const xHeight = 0.45;


//how much is the superscript shifted up relative 
//to the top of the (non-char)nucleus box.
//use negative values to shift down!
const supLift = -0.16;

//how much is the subscript shifted up relative
//to the bottom of the (non-char)nucleus box
const subLift = 0.12;


//fixed y-coordinate for superscript in cramped style (priority 1)
//is called "sup3" in tex
const supYCramped = 0.3;

//fixed y-coordinate for superscript in display-style (priority 2)
//is called "sup1" in tex
const supYDisplay = 0.42;

//default fixed y-coordinate for superscript (priority 3)
//is called "sup2" in tex
const supYDefault = 0.35;


//fixed y-coordinate for subscript when superscript is empty
//is called "sub1" in tex
const subYSupEmpty = -0.15;

//fixed y-coordinate for subscript when superscript is not empty
//is called "sub2" in tex
const subYSupNotEmpty = -0.28;



const getSubOrSupStyle = (scriptStyle: Style, subOrSupNode: FormulaNode) : Style => {
	return subOrSupNode.type === "fraction" ? smallestStyle(scriptStyle) : smallerStyle(scriptStyle);
};



const getPositionXOfSupAtCharNucleus = (nucleus: BoxCharNode, mainStyle: Style) => {
	const metrics = getMetricsOfCharNode(nucleus);
	return (metrics.width + metrics.italicCorrection) * mainStyle.fontSize;
};
const getFixedSupY = (mainStyle: Style) => {
    if (mainStyle.cramped) return supYCramped;
    if (isDisplayStyle(mainStyle)) return supYDisplay;
    return supYDefault;
};
const layoutSup = (mainStyle: Style, nucleusLayouted: BoxNode) => ((sup: FormulaNode) : BoxNode => {
	const supStyle = getSubOrSupStyle(mainStyle, sup);
	const supLayouted: BoxNode = layoutWithStyle(supStyle)(sup);
    const mainFontSize = mainStyle.fontSize;

	const positionY = Math.max(
        nucleusLayouted.type === "char" ? 0 : nucleusLayouted.dimensions.yMax + supLift * mainFontSize,
        getFixedSupY(mainStyle) * mainFontSize,
        mainFontSize * (xHeight / 4) - supLayouted.dimensions.yMin 
    );

	//add a small spacing
	const horizontalSpacing = 0;//0.08 * mainFontSize;
	const positionX = (nucleusLayouted.type === "char" ? 
		getPositionXOfSupAtCharNucleus(nucleusLayouted as BoxCharNode, mainStyle) : 
		nucleusLayouted.dimensions.width
	) + horizontalSpacing;

	return setPosition([positionX, positionY])(supLayouted);
});

const layoutSub = (mainStyle: Style, nucleusLayouted: BoxNode, hasSup: boolean) => ((sub: FormulaNode) : BoxNode => {
    const subLayouted = layoutWithStyle(getSubOrSupStyle(mainStyle, sub))(sub);
    const mainFontSize = mainStyle.fontSize;
    const targetY = nucleusLayouted.type === "char" ? 0 : nucleusLayouted.dimensions.yMin + subLift * mainFontSize;
    return setPosition([
        nucleusLayouted.dimensions.width,
        hasSup ? Math.min(targetY, subYSupNotEmpty * mainFontSize) : 
            Math.min(targetY, subYSupEmpty * mainFontSize, mainFontSize * 0.8 * xHeight - subLayouted.dimensions.yMax)
	])(subLayouted);
});


interface SupSubMap {
    sup?: BoxNode,
    sub?: BoxNode
};

//if the sub- and superscript overlap, move the subscript down to make enough space
const depenetrate = (fontSize: number) => ((supSubMap: SupSubMap) : SupSubMap => {
    const maxSubTop = boxBottom(supSubMap.sup) - (4 * defaultRuleThickness) * fontSize;
    const overlap = maxSubTop - boxTop(supSubMap.sub);
    const newSubY = Math.min(0, overlap) + supSubMap.sub.position[1];
    return assocPath(["sub", "position", 1], newSubY, supSubMap);
});

//if the superscript is below 0.8 * xHeight, move both super- and subscript up
const adjustAlignment =  (fontSize: number) => ((supSubMap: SupSubMap) : SupSubMap => {
    const minSupBottom = 0.8 * xHeight * fontSize;
    const overlap = minSupBottom - boxBottom(supSubMap.sup);
    const shift = Math.max(0, overlap);
    return map(moveBox([0, shift]))(supSubMap);
});
const supAndSubNotEmpty = (supSubMap: SupSubMap) : boolean => isDefined(supSubMap.sup) && isDefined(supSubMap.sub);

export const layoutScriptInNoLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
	validateProperties({
		nucleus: "object"
	})(script);

    const { style } = script;
    const { fontSize } = style;

	const nucleusLayouted: BoxNode = pipe(layoutWithStyle(style), setPosition([0, 0]))(script.nucleus);

    const supAndSubLayouted = pipe(
        pick(["sup", "sub"]), 
        layoutByMap({
            sup: layoutSup(style, nucleusLayouted),
            sub: layoutSub(style, nucleusLayouted, script.sup !== undefined)
        }) as SupSubMap,
        when(supAndSubNotEmpty, pipe(depenetrate(fontSize), adjustAlignment(fontSize)))
    )(script) as SupSubMap;

	const scriptLayouted = {
		nucleus: nucleusLayouted,
		...supAndSubLayouted
	};

	const dimensions = calcBoundingDimensions(pickList(["nucleus", "sup", "sub"], scriptLayouted).filter(isDefined));

	return {
		type: "script", style, dimensions,
		...scriptLayouted
	};
};
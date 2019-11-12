import { identity } from "ramda";
import { FormulaNode } from "./types";

export interface Style {
	type?: string,
	fontSize?: number,
	emphasis?: string,
	fontFamily?: string,
	cramped?: boolean
};

export const styleType = {
	D: "D", T: "T", S: "S", SS: "SS"
};
const styleTypeArray = ["D", "T", "S", "SS"];
const getSmallerStyleType = (type: string) => (type === styleType.D || type === styleType.T) ? styleType.S : styleType.SS;
const incrementStyleType = (type: string) => styleTypeArray[Math.min(styleTypeArray.indexOf(type) + 1, styleTypeArray.length - 1)];


const styleTypeToFontScale = {
	D: 1, T: 1, S: 0.7, SS: 0.5
};
export const fontSizeOfStyleType = (defaultFontSize: number, styleType: string) => defaultFontSize * styleTypeToFontScale[styleType];

const getBaseFontSize = (style: Style) : number => style.fontSize / styleTypeToFontScale[style.type];
export const switchStyleType = (style: Style, nextStyleType: string): Style => identity({
	...style, type: nextStyleType,
	fontSize: fontSizeOfStyleType(getBaseFontSize(style), nextStyleType)
});
export const incrementStyle = (style: Style) => switchStyleType(style, incrementStyleType(style.type));
export const smallerStyle = (style: Style) => switchStyleType(style, getSmallerStyleType(style.type));
export const smallestStyle = (style: Style) => switchStyleType(style, styleType.SS);
export const isDisplayStyle = (style: Style) => style.type === styleType.D;

//if the node already has a style, merge the supplied style with it
export const createNodeStyle = (node: FormulaNode, style: Style) => identity({
	...style, ...(node.style || {})
});

//returns a functor that merges the nodes style with the supplied style
export const withStyle = (style: Style) => ((node: FormulaNode) => identity({ ...node, style: createNodeStyle(node, style) }));
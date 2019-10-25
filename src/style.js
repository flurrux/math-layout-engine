import { identity } from "./util";

export const styleType = {
	D: "D", T: "T", S: "S", SS: "SS"
};
const styleTypeArray = ["D", "T", "S", "SS"];
const getSmallerStyleType = type => (type === styleType.D || type === styleType.T) ? styleType.S : styleType.SS;
const incrementStyleType = type => styleTypeArray[Math.min(styleTypeArray.indexOf(type) + 1, styleTypeArray.length - 1)];


const styleTypeToFontScale = {
	D: 1, T: 1, S: 0.7, SS: 0.5
};
export const fontSizeOfStyleType = (defaultFontSize, styleType) => defaultFontSize * styleTypeToFontScale[styleType];


const switchStyleType = (style, nextStyleType) => identity({
	...style, type: nextStyleType,
	fontSize: fontSizeOfStyleType(style.baseFontSize, nextStyleType)
});
export const incrementStyle = (style) => switchStyleType(style, incrementStyleType(style.type));
export const smallerStyle = (style) => switchStyleType(style, getSmallerStyleType(style.type));
export const smallestStyle = (style) => switchStyleType(style, styleType.SS);

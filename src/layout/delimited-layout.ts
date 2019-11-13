import { layoutNode } from "./layout";
import { setPosition, calcBoundingDimensions, getAxisHeight, isNodeAlignedToBaseline } from './layout-util';
import { createDelimiter } from "../glyph-modification/create-delimiter";
import { accumSum } from "../util/util";
import { map, pipe, multiply, identity } from 'ramda';
import { withStyle } from "../style";
import { lookUpHorizontalSpacing } from "./horizontal-layout";

import { DelimitedNode as FormulaDelimitedNode, FormulaNode, Dimensions, BoxNode, CharNode } from '../types';
import { Style } from '../style';
import { BoxMathListNode } from './mathlist-layout';
import { lookUpGlyphByCharOrAlias } from "../font-data/katex-font-util";
import { validateProperties } from "./error";

const calculateDelimiterHeight = (delimited: FormulaNode, delimitedMetrics: Dimensions, style: Style): number => {
	const axisOffset = isNodeAlignedToBaseline(delimited) ? -getAxisHeight(style) : 0;
	const [height, depth] = [delimitedMetrics.yMax, delimitedMetrics.yMin]
		.map(val => val + axisOffset)
		.map(val => val / style.fontSize);
	const delimiterSpacing = 0.15;
	return Math.max(height, -depth) + delimiterSpacing;
};

const validOpenChars = [
	"(", "[", "{", "⟨", "|", "⌈", "⌊"
];
const validCloseChars = [
	")", "]", "}", "⟩", "|", "⌉", "⌋"
];
const validateDelimiterNode = (delimNode: any, label: string, isOpen: boolean) => {
	//{ type: "open", value: "(" | "[" | "{" | "⟨" | "|" | "⌉" | "⌋" }
	//{ type: "close", value: "" }
	if (typeof(delimNode.type) !== "string") throw `${label} is either missing the type-property or it's not a string`;
	const requiredType = isOpen ? "open" : "close";
	if (delimNode.type !== requiredType) throw `${label} must be of type ${requiredType}`;
	if (typeof(delimNode.value) !== "string") throw `${label} is either missing the value-property or it's not a string`;

	const char = String.fromCharCode(lookUpGlyphByCharOrAlias(delimNode.value).unicode);
	const curValidChars = isOpen ? validOpenChars : validCloseChars;
	if (!curValidChars.includes(char)) throw `${char} is not a valid ${requiredType}-character`;
};
export const layoutDelimited = (delimNode: FormulaDelimitedNode) : BoxMathListNode => {
	validateProperties({
		delimited: "object",
		leftDelim: "object",
		rightDelim: "object"
	})(delimNode);
	
	const { delimited } = delimNode;
	const { style } = delimNode;
	const delimitedLayouted: BoxNode = pipe(withStyle(style), layoutNode)(delimited);
	
	const { leftDelim, rightDelim } = delimNode;
	validateDelimiterNode(leftDelim, "leftDelim", true);
	validateDelimiterNode(rightDelim, "rightDelim", false);

	const delimiterHeight = calculateDelimiterHeight(delimited, delimitedLayouted.dimensions, style);
	const [leftDelimBox, rightDelimBox] = [leftDelim, rightDelim]
		.map(delimNode => createDelimiter((delimNode as CharNode).value.charCodeAt(0), delimiterHeight))
		.map(delim => identity({ 
			...delim, dimensions: map(multiply(style.fontSize), delim.dimensions), style 
		})) as [BoxNode, BoxNode];

	const itemXs = accumSum([
		leftDelimBox.dimensions.width + lookUpHorizontalSpacing(leftDelimBox, delimited),
		delimitedLayouted.dimensions.width + lookUpHorizontalSpacing(delimited, rightDelimBox)
	]);
	const items = [
		setPosition([itemXs[0], 0])(leftDelimBox),
		setPosition([
			itemXs[1], isNodeAlignedToBaseline(delimited) ? 0 : getAxisHeight(style)
		])(delimitedLayouted),
		setPosition([itemXs[2], 0])(rightDelimBox)
	];
	return {
		type: "mathlist",
		dimensions: calcBoundingDimensions(items),
		items
	};
};
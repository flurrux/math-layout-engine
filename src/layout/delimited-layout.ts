import { layoutNode } from "./layout";
import { setPosition, calcBoundingDimensions, getAxisHeight, isNodeAlignedToBaseline } from './layout-util';
import { createDelimiter } from "../glyph-modification/create-delimiter";
import { accumSum } from "../util";
import { map, pipe, multiply, identity } from 'ramda';
import { withStyle } from "../style.js";
import { lookUpHorizontalSpacing } from "./horizontal-layout";

import { DelimitedNode as FormulaDelimitedNode, FormulaNode, Dimensions, BoxNode } from '../types';
import { Style } from '../style';
import { BoxMathListNode } from './mathlist-layout';

const calculateDelimiterHeight = (delimited: FormulaNode, delimitedMetrics: Dimensions, style: Style): number => {
	const axisOffset = isNodeAlignedToBaseline(delimited) ? -getAxisHeight(style) : 0;
	const [height, depth] = [delimitedMetrics.yMax, delimitedMetrics.yMin]
		.map(val => val + axisOffset)
		.map(val => val / style.fontSize);
	const delimiterSpacing = 0.15;
	return Math.max(height, -depth) + delimiterSpacing;
};
export const layoutDelimited = (delimNode: FormulaDelimitedNode) : BoxMathListNode => {
	const { delimited } = delimNode;
	const { style } = delimNode;
	const delimitedLayouted: BoxNode = pipe(withStyle(style), layoutNode)(delimited);
	
	const delimiterHeight = calculateDelimiterHeight(delimited, delimitedLayouted.dimensions, style);

	const [leftDelim, rightDelim] = ["leftDelim", "rightDelim"]
		.map(propName => createDelimiter(delimNode[propName].value.charCodeAt(0), delimiterHeight))
		.map(delim => identity({ 
			...delim, dimensions: map(multiply(style.fontSize), delim.metrics), style 
		})) as [BoxNode, BoxNode];

	const itemXs = accumSum([
		leftDelim.dimensions.width + lookUpHorizontalSpacing(leftDelim, delimited),
		delimitedLayouted.dimensions.width + lookUpHorizontalSpacing(delimited, rightDelim)
	]);
	const items = [
		setPosition([itemXs[0], 0])(leftDelim),
		setPosition([
			itemXs[1], isNodeAlignedToBaseline(delimited) ? 0 : getAxisHeight(style)
		])(delimitedLayouted),
		setPosition([itemXs[2], 0])(rightDelim)
	];
	return {
		type: "mathlist",
		dimensions: calcBoundingDimensions(items),
		items
	};
};
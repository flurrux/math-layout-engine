import { 
	getAxisHeight, layoutNode, calcBoundingDimensions, 
	isNodeAlignedToBaseline 
} from "./layout";
import { setPosition } from './layout-util';
import { createDelimiter } from "../glyph-modification/create-delimiter";
import { identity, accumSum, scaleMap } from "../util.js";
import { map, pipe } from 'ramda';
import { withStyle } from "../style.js";
import { lookUpHorizontalSpacing } from "./horizontal-layout.js";

const calculateDelimiterHeight = (delimited, delimitedMetrics, style) => {
	const axisOffset = isNodeAlignedToBaseline(delimited) ? -getAxisHeight(style) : 0;
	const [height, depth] = [delimitedMetrics.yMax, delimitedMetrics.yMin]
		.map(val => val + axisOffset)
		.map(val => val / style.fontSize);
	const delimiterSpacing = 0.15;
	return Math.max(height, -depth) + delimiterSpacing;
};
export const layoutDelimited = (delimNode) => {
	const { delimited } = delimNode;
	const { style } = delimNode;
	const delimitedLayouted = pipe(withStyle(style), layoutNode)(delimited);
	
	const delimiterHeight = calculateDelimiterHeight(delimited, delimitedLayouted.dimensions, style);

	const [leftDelim, rightDelim] = ["leftDelim", "rightDelim"]
		.map(propName => createDelimiter(delimNode[propName].value.charCodeAt(0), delimiterHeight))
		.map(delim => identity({ 
			...delim, dimensions: map(scaleMap(style.fontSize), delim.metrics), style 
		}));

	const itemXs = accumSum([
		leftDelim.dimensions.width + lookUpHorizontalSpacing("open", delimited.type),
		delimitedLayouted.dimensions.width + lookUpHorizontalSpacing(delimited.type, "close")
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
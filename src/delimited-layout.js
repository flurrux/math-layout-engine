import { getAxisHeight, layoutNode, getHorizontalSpacingBetweenNodes, calcBoundingDimensions, isNodeAlignedToBaseline, withPosition, getAxisAlignment } from "./layout";
import { createDelimiter } from "./create-delimiter";
import { identity, accumSum, scaleMap } from "./util";
import { map } from 'ramda';

const calculateDelimiterHeight = (delimited, delimitedMetrics, style) => {
	const axisOffset = isNodeAlignedToBaseline(delimited) ? -getAxisHeight(style) : 0;
	const [height, depth] = [delimitedMetrics.yMax, delimitedMetrics.yMin]
		.map(val => val + axisOffset)
		.map(val => val / style.fontSize);
	const delimiterSpacing = 0.1;
	return Math.max(height, -depth) + delimiterSpacing;
};
export const layoutDelimited = (style, delimNode) => {
	const { delimited } = delimNode;
	const delimitedLayouted = layoutNode(style, delimited);
	
	const delimiterHeight = calculateDelimiterHeight(delimited, delimitedLayouted.dimensions, style);

	const [leftDelim, rightDelim] = ["leftDelim", "rightDelim"]
		.map(propName => createDelimiter(delimNode[propName].value.charCodeAt(0), delimiterHeight))
		.map(delim => identity({ 
			...delim, dimensions: map(scaleMap(style.fontSize), delim.metrics), style 
		}));

	const itemXs = accumSum([
		leftDelim.dimensions.width + getHorizontalSpacingBetweenNodes("open", delimited.type),
		delimitedLayouted.dimensions.width + getHorizontalSpacingBetweenNodes(delimited.type, "close")
	]);
	console.log(itemXs);

	const items = [
		withPosition(leftDelim, [itemXs[0], 0]),
		withPosition(delimitedLayouted, [
			itemXs[1], isNodeAlignedToBaseline(delimited) ? 0 : getAxisHeight(style)
		]),
		withPosition(rightDelim, [itemXs[2], 0])
	];
	return {
		type: "mathlist",
		dimensions: calcBoundingDimensions(items),
		style, items
	};
};
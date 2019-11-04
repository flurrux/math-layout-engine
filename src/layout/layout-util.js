
import * as R from 'ramda';

export const boxRight = boxNode => boxNode.position[0] + boxNode.dimensions.width;
export const boxTop = boxNode => boxNode.position[1] + boxNode.dimensions.yMax;
export const boxBottom = boxNode => boxNode.position[1] + boxNode.dimensions.yMin;
export const boxLeft = boxNode => boxNode.position[0];

export const calcBoundingDimensions = objs => R.identity({
	width: Math.max(...objs.map(boxRight)),
	yMin: Math.min(...objs.map(boxBottom)),
	yMax: Math.max(...objs.map(boxTop)),
});

export const dimensionHeight = dimensions => dimensions.yMax - dimensions.yMin;

export const center = (size, availableSize) => (availableSize - size) / 2;

export const setPosition = (position) => R.assoc("position", position);

export const moveBox = (positionDelta) => (box => R.assoc("position", [
	box.position[0] + positionDelta[0],
	box.position[1] + positionDelta[1]
], box));

//this function handles overflow to the left side (xMin < 0)
export const alignToYAxis = (objs) => R.map(
	R.pipe(
		R.map(boxLeft), min, R.multiply(-1), R.max(0), (shift) => moveBox([shift, 0])
	)(objs)
)(objs);


//axisHeight means the vertical position of the axis relative to the baseline. 
//this value is fixed and only scales with the font-size.
const normalizedAxisHeight = 0.25;
export const getAxisHeight = style => style.fontSize * normalizedAxisHeight;


const isNodeOfAnyType = (node, types) => types.includes(node.type);

export const isNodeAlignedToBaseline = (node) => isNodeOfAnyType(node, ["mathlist", "script"]) ||
	isNodeTextual(node) || (node.type === "root" && isNodeAlignedToBaseline(node.radicand));

const isNodeAlignedToAxis = (node) => isNodeOfAnyType(node, ["fraction"]) ||
	(node.type === "root" && isNodeAlignedToAxis(node.radicand));

//if a node is aligned to the axis rather than the baseline, this function will get the vertical offset
const getAxisAlignment = (style, node) => isNodeAlignedToAxis(node) ? getAxisHeight(style) : 0;



const offsetDimensionsVertically = (dimensions, offset) => R.identity({
	...dimensions,
	yMin: dimensions.yMin + offset,
	yMax: dimensions.yMax + offset
});

const scaleMetrics = (metrics, scale) => R.map(R.multiply(scale), metrics);

const getHeightAndDepthFromAxis = (node, dim, axisHeight) => {
	return isNodeAlignedToBaseline(node) ? [dim.yMax - axisHeight, dim.yMin - axisHeight] : [dim.yMax, dim.yMin];
};
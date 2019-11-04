
import * as R from 'ramda';


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


const offsetDimensionsVertically = (dimensions, offset) => identity({
	...dimensions,
	yMin: dimensions.yMin + offset,
	yMax: dimensions.yMax + offset
});

const scaleMetrics = (metrics, scale) => R.map(scaleMap(scale), metrics);

const getHeightAndDepthFromAxis = (node, dim, axisHeight) => {
	return isNodeAlignedToBaseline(node) ? [dim.yMax - axisHeight, dim.yMin - axisHeight] : [dim.yMax, dim.yMin];
};

import { pipe, map, identity, multiply, max as maxOf2, assoc } from 'ramda';
import { Style } from '../style';
import { BoxNode, Dimensions, Vector2, FormulaNode, RootNode } from '../types';
import { Metrics } from '../font-data/katex-font-util';
import { min, max, valuesInObject } from '../util/util';
import { isNodeTextual } from '../node-types';

type ObjectOrArrayOfBoxNodes = { [key: string]: BoxNode } | BoxNode[];

export const boxRight = (boxNode: BoxNode) : number => boxNode.position[0] + boxNode.dimensions.width;
export const boxTop = (boxNode: BoxNode) : number => boxNode.position[1] + boxNode.dimensions.yMax;
export const boxBottom = (boxNode: BoxNode) : number => boxNode.position[1] + boxNode.dimensions.yMin;
export const boxLeft = (boxNode: BoxNode) : number => boxNode.position[0];

const arrayify = (obj: ObjectOrArrayOfBoxNodes) : BoxNode[] => valuesInObject(obj);

const calcBoundingDimensionsOfBoxNodeArray = (boxNodes: BoxNode[]): Dimensions => identity({
	width: pipe(map(boxRight), max)(boxNodes),
	yMin: pipe(map(boxBottom), min)(boxNodes),
	yMax: pipe(map(boxTop), max)(boxNodes)
});
export const calcBoundingDimensions = (objs: ObjectOrArrayOfBoxNodes) : Dimensions => pipe(arrayify, calcBoundingDimensionsOfBoxNodeArray)(objs);

export const dimensionHeight = (dimensions: Dimensions) => dimensions.yMax - dimensions.yMin;

export const center = (size: number, availableSize: number) => (availableSize - size) / 2;

export const setPosition = <T extends BoxNode>(position: Vector2): ((obj: T) => T) => assoc("position", position);

export const moveBox = (positionDelta: Vector2) : ((box: BoxNode) => BoxNode) => ((box: BoxNode) => assoc("position", [
	box.position[0] + positionDelta[0],
	box.position[1] + positionDelta[1]
], box));

//this function handles overflow to the left side (xMin < 0)
export const alignToYAxis = (objs: ObjectOrArrayOfBoxNodes) : ObjectOrArrayOfBoxNodes => {
	return map(
		pipe(
			map(boxLeft), min, multiply(-1), maxOf2(0), (shift: number) => moveBox([shift, 0])
		)(objs)
	)(objs);
};


//axisHeight means the vertical position of the axis relative to the baseline. 
//this value is fixed and only scales with the font-size.
const normalizedAxisHeight = 0.25;
export const getAxisHeight = (style: Style) => style.fontSize * normalizedAxisHeight;


const isNodeOfAnyType = (node: FormulaNode, types: string[]) : boolean => types.includes(node.type);

export const isNodeAlignedToBaseline = (node: FormulaNode) : boolean => isNodeOfAnyType(node, ["mathlist", "script"]) ||
	isNodeTextual(node) || (node.type === "root" && isNodeAlignedToBaseline((node as RootNode).radicand));



const offsetDimensionsVertically = (dimensions: Dimensions, offset: number): Dimensions => identity({
	...dimensions,
	yMin: dimensions.yMin + offset,
	yMax: dimensions.yMax + offset
});

const scaleMetrics = (metrics: Metrics, scale: number): Metrics => map(multiply(scale), metrics);

const getHeightAndDepthFromAxis = (node: FormulaNode, dim: Dimensions, axisHeight: number): [number, number] => {
	return isNodeAlignedToBaseline(node) ? [dim.yMax - axisHeight, dim.yMin - axisHeight] : [dim.yMax, dim.yMin];
};
import { layoutNode } from "./layout";
import { setPosition, dimensionHeight, calcBoundingDimensions } from './layout-util';
import { isDefined } from "../util";
import { map, pipe, multiply } from 'ramda';
import { createRadical } from "../glyph-modification/create-radical";
import { switchStyleType, withStyle } from "../style";

import { BoxNode, RootNode as FormulaRootNode, ContoursNode, Vector2 } from '../types';
import { validateProperties } from "./error";

export interface BoxRootNode {
	radicand: BoxNode
};

export const layoutRoot = (root: FormulaRootNode) => {
	validateProperties({
		radicand: "object"
	})(root);

	const { style } = root;
	const { fontSize } = style;
	let radicandLayouted = pipe(withStyle(style), layoutNode)(root.radicand);

	const radicandDim = radicandLayouted.dimensions;
	const radicandDimEm = map(multiply(1 / fontSize), radicandLayouted.dimensions);
	const margin = [0.07, 0.18];
	const [radicandWidth, radicandHeight] = [
		margin[0] * 2 + radicandDimEm.width,
		margin[1] * 2 + dimensionHeight(radicandDimEm)
	];

	const radical = createRadical(radicandWidth, radicandHeight);
	const rootMetrics = map(multiply(fontSize), radical.dimensions);
	const rootContours = radical.contours;

	const spareYHalf = (radical.innerHeight * fontSize - radicandDim.yMax + radicandDim.yMin) * 0.7;
	const contourY = spareYHalf - (rootMetrics.yMax - radicandDim.yMax);
	const contoursOffset = [0, contourY];

	const radicandPosition = [
		fontSize * (radical.innerStartX + margin[0]), 0
	];
	Object.assign(radicandLayouted, { position: radicandPosition });

	let radicalLayouted : ContoursNode = {
		type: "contours", style,
		contours: rootContours,
		position: [contoursOffset[0], contoursOffset[1] + radicandPosition[1]],
		dimensions: rootMetrics
	};


	//index
	let indexLayouted : BoxNode = root.index ? (function () {
		const indexLayouted : BoxNode = pipe(withStyle(switchStyleType(style, "SS")), layoutNode)(root.index);
		const scaledCorner : Vector2 = map(multiply(style.fontSize))(radical.indexCorner) as Vector2;
		const rightBottomPosition = [
			contoursOffset[0] + scaledCorner[0],
			contoursOffset[1] + scaledCorner[1]
		];
		const indexPosition : Vector2 = [
			rightBottomPosition[0] - indexLayouted.dimensions.width,
			rightBottomPosition[1] - indexLayouted.dimensions.yMin
		];
		return setPosition(indexPosition)(indexLayouted);
	})() as BoxNode : undefined;

	const shift = (indexLayouted && indexLayouted.position[0] < 0) ? -indexLayouted.position[0] : 0;
	if (shift > 0){
		indexLayouted.position[0] = 0;
		radicandLayouted.position[0] += shift;
		radicalLayouted.position[0] += shift;
	}

	const dimensions = calcBoundingDimensions([radicalLayouted, indexLayouted].filter(isDefined));

	return {
		type: "root", dimensions,
		radical: radicalLayouted,
		radicand: radicandLayouted,
		...(indexLayouted ? { index: indexLayouted } : {})
	}
};
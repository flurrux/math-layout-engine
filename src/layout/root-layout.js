import { layoutNode, dimensionHeight, calcBoundingDimensions } from "./layout";
import { setPosition } from './layout-util';
import { scaleMap, isDefined } from "../util";
import { map, pipe } from 'ramda';
import { createRadical } from "../glyph-modification/create-radical";
import { switchStyleType, withStyle } from "../style";

export const layoutRoot = (root) => {
	const { style } = root;
	const { fontSize } = style;
	let radicandLayouted = pipe(withStyle(style), layoutNode)(root.radicand);

	const radicandDim = radicandLayouted.dimensions;
	const radicandDimEm = map(scaleMap(1 / fontSize), radicandLayouted.dimensions);
	const margin = [0.07, 0.18];
	const [radicandWidth, radicandHeight] = [
		margin[0] * 2 + radicandDimEm.width,
		margin[1] * 2 + dimensionHeight(radicandDimEm)
	];

	const radical = createRadical(radicandWidth, radicandHeight, fontSize / 50);
	const rootMetrics = map(scaleMap(fontSize), radical.metrics);
	const rootContours = radical.contours;

	const spareYHalf = (radical.innerHeight * fontSize - radicandDim.yMax + radicandDim.yMin) * 0.7;
	const contourY = spareYHalf - (rootMetrics.yMax - radicandDim.yMax);
	const contoursOffset = [0, contourY];

	const radicandPosition = [
		fontSize * (radical.innerStartX + margin[0]), 0
	];
	Object.assign(radicandLayouted, { position: radicandPosition });

	let radicalLayouted = {
		type: "contours", style,
		contours: rootContours,
		position: [contoursOffset[0], contoursOffset[1] + radicandPosition[1]],
		dimensions: rootMetrics
	};


	//index
	let indexLayouted = root.index ? (function () {
		const indexLayouted = pipe(withStyle(switchStyleType(style, "SS")), layoutNode)(root.index);
		const scaledCorner = radical.indexCorner.map(scaleMap(style.fontSize));
		const rightBottomPosition = [
			contoursOffset[0] + scaledCorner[0],
			contoursOffset[1] + scaledCorner[1]
		];
		const indexPosition = [
			rightBottomPosition[0] - indexLayouted.dimensions.width,
			rightBottomPosition[1] - indexLayouted.dimensions.yMin
		];
		return setPosition(indexPosition)(indexLayouted);
	})() : undefined;

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
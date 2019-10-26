import { incrementStyle } from "./style";
import { layoutWithStyle, dimensionHeight, withPosition, calcBoundingDimensions, boxTop, boxBottom } from "./layout";
import { isNodeTextual } from "./node-types";

const normalizedRuleThickness = 0.05;
const getRuleThickness = style => style.fontSize * normalizedRuleThickness;

/*
	if a node is textual, it has a fixed y-position that's multiplied by the font-size
*/

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205
const calculateNumeratorPositionY = (num, style, metrics) => isNodeTextual(num) ? -maxTextualDepth * style.fontSize : -metrics.yMin;
const calculateDenominatorPositionY = (denom, style, metrics) => isNodeTextual(denom) ? -maxTextualHeight * style.fontSize : -metrics.yMax;

export const layoutFraction = (style, fraction) => {
	const subStyle = incrementStyle(style);
	const [num, denom] = [fraction.numerator, fraction.denominator].map(layoutWithStyle(subStyle));


	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const topSpacing = ruleThickness * 2;
	const bottomSpacing = ruleThickness * 2;

	const numY = halfRuleThickness + topSpacing + calculateNumeratorPositionY(fraction.numerator, subStyle, num.dimensions);
	const denomY = -(halfRuleThickness + bottomSpacing) + calculateDenominatorPositionY(fraction.denominator, subStyle, denom.dimensions);

	const horizontalPadding = style.fontSize * 0.2;
	const maxWidth = Math.max(...[num, denom].map(n => n.dimensions.width));
	const width = maxWidth + 2 * horizontalPadding;
	const middleXs = [num, denom].map(n => calcCentering(n.dimensions.width, width));

	const numPos = [middleXs[0], numY];
	const denomPos = [middleXs[1], denomY];


	return {
		type: "fraction", style,
		numerator: withPosition(num, numPos),
		denominator: withPosition(denom, denomPos),
		ruleThickness,
		dimensions: {
			yMin: denomPos[1] + denom.dimensions.yMin, 
			yMax: numPos[1] + num.dimensions.yMax,
			width
		}
	};
};
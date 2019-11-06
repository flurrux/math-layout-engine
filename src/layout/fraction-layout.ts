import { incrementStyle, withStyle } from "../style";
import { layoutNode } from "./layout";
import { setPosition } from './layout-util';
import { center as calcCentering } from './layout-util';
import { isNodeTextual } from "../node-types";
import { map, pipe } from 'ramda';

import { FormulaNode, FractionNode as FormulaFractionNode, BoxNode, Dimensions, Vector2 } from '../types';
import { Style } from '../style';

interface BoxFractionNode extends BoxNode {
	numerator: BoxNode,
	denominator: BoxNode,
	ruleThickness: number
};

const normalizedRuleThickness = 0.05;
const getRuleThickness = (style: Style) => style.fontSize * normalizedRuleThickness;

/*
	if a node is textual, it has a fixed y-position that's multiplied by the font-size
*/

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205
const calculateNumeratorPositionY = (num: FormulaNode, style: Style, dim: Dimensions) => isNodeTextual(num) ? -maxTextualDepth * style.fontSize : -dim.yMin;
const calculateDenominatorPositionY = (denom: FormulaNode, style: Style, dim: Dimensions) => isNodeTextual(denom) ? -maxTextualHeight * style.fontSize : -dim.yMax;

export const layoutFraction = (fraction: FormulaFractionNode) : BoxFractionNode => {
	const { style } = fraction;
	const subStyle = incrementStyle(style);
	const num: BoxNode = pipe(withStyle(subStyle), layoutNode)(fraction.numerator);
	const denom: BoxNode = pipe(withStyle({ ...subStyle, cramped: true }), layoutNode)(fraction.denominator);

	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const topSpacing = ruleThickness * 3;
	const bottomSpacing = ruleThickness * 3;

	const numY = halfRuleThickness + topSpacing + calculateNumeratorPositionY(fraction.numerator, subStyle, num.dimensions);
	const denomY = -(halfRuleThickness + bottomSpacing) + calculateDenominatorPositionY(fraction.denominator, subStyle, denom.dimensions);

	const horizontalPadding = style.fontSize * 0.2;
	const maxWidth = Math.max(...[num, denom].map(n => n.dimensions.width));
	const width = maxWidth + 2 * horizontalPadding;
	const middleXs = [num, denom].map(n => calcCentering(n.dimensions.width, width));

	const numPos: Vector2 = [middleXs[0], numY];
	const denomPos: Vector2 = [middleXs[1], denomY];


	return {
		type: "fraction", style,
		numerator: setPosition(numPos)(num),
		denominator: setPosition(denomPos)(denom),
		ruleThickness,
		dimensions: {
			yMin: denomPos[1] + denom.dimensions.yMin, 
			yMax: numPos[1] + num.dimensions.yMax,
			width
		}
	};
};
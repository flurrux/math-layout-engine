import { incrementStyle, withStyle, isDisplayStyle } from "../style";
import { layoutNode } from "./layout";
import { setPosition, getAxisHeight, boxBottom, boxTop } from './layout-util';
import { center as calcCentering } from './layout-util';
import { isNodeTextual } from "../node-types";
import { map, pipe } from 'ramda';

import { FormulaNode, FractionNode as FormulaFractionNode, BoxNode, Dimensions, Vector2 } from '../types';
import { Style } from '../style';
import { max } from "../util";

interface BoxFractionNode extends BoxNode {
	numerator: BoxNode,
	denominator: BoxNode,
	ruleThickness: number
};

/*
	in the texbook the layout of fractions is as follows:
	the numerator and denominator are set to a fixed position (relative to the baseline) 
	which depends of the style. 
	there is a minimal spacing that also depends on the style.
	if the numerator of denominator overflows, shift them accordingly so 
	that the spacing is satisfied.
*/

const defaultRuleThickness = 0.05;
const getRuleThickness = (style: Style) => style.fontSize * defaultRuleThickness;

const maxTextualHeight = 0.685;
const maxTextualDepth = -0.205

const numeratorYDisplayStyle = 0;
const numeratorYInlineStyle = 0;

const denominatorYDisplayStyle = 0;
const denominatorYInlineStyle = 0;

const horizontalPadding = 0.2;

const calculateNumeratorPositionY = (numerator: BoxNode, fontSize: number, isDisplay: boolean, minBottom: number) : number => {
	const y = (isDisplay ? numeratorYDisplayStyle : numeratorYInlineStyle) * fontSize;
	const bottom = y + numerator.dimensions.yMin;
	return bottom > minBottom ? y : (minBottom - numerator.dimensions.yMin);
};
const calculateDenominatorPositionY = (denom: BoxNode, fontSize: number, isDisplay: boolean, maxTop: number) : number => {
	const y = (isDisplay ? denominatorYDisplayStyle : denominatorYInlineStyle) * fontSize;
	const top = y + denom.dimensions.yMax;
	return top < maxTop ? y : (maxTop - denom.dimensions.yMax);
};


export const layoutFraction = (fraction: FormulaFractionNode) : BoxFractionNode => {
	const { style } = fraction;
	const { fontSize } = style;
	const isDisplay = isDisplayStyle(style);
	const subStyle = incrementStyle(style);
	const num: BoxNode = pipe(withStyle(subStyle), layoutNode)(fraction.numerator);
	const denom: BoxNode = pipe(withStyle({ ...subStyle, cramped: true }), layoutNode)(fraction.denominator);

	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const minSpacing = (isDisplay ? 3 : 1) * ruleThickness;

	const axisHeight = getAxisHeight(style);

	const numeratorY = calculateNumeratorPositionY(num, fontSize, isDisplay, axisHeight + halfRuleThickness);
	const denomY = calculateDenominatorPositionY(denom, fontSize, isDisplay, axisHeight - halfRuleThickness);

	//calculate width and center items horizontally
	const maxWidth = max([num, denom].map(n => n.dimensions.width));
	const width = maxWidth + (2 * horizontalPadding * style.fontSize);
	const middleXs = [num, denom].map(n => calcCentering(n.dimensions.width, width));

	const numPos: Vector2 = [middleXs[0], numeratorY];
	const denomPos: Vector2 = [middleXs[1], denomY];

	const dimensions = {
		width,
		yMax: boxTop(num),
		yMin: boxBottom(denom)
	};

	return {
		type: "fraction", style,
		numerator: setPosition(numPos)(num),
		denominator: setPosition(denomPos)(denom),
		ruleThickness,
		dimensions
	};
};
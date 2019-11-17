import { incrementStyle, withStyle, isDisplayStyle } from "../style";
import { layoutNode } from "./layout";
import { setPosition, getAxisHeight, boxBottom, boxTop } from './layout-util';
import { center as calcCentering } from './layout-util';
import { pipe } from 'ramda';

import { FractionNode as FormulaFractionNode, BoxNode, RuleNode } from '../types';
import { Style } from '../style';
import { max } from "../util/util";
import { validateProperties } from "./error";

export interface BoxFractionNode extends BoxNode {
	numerator: BoxNode,
	denominator: BoxNode,
	rule: RuleNode
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
const axisHeight = 0.25;

const numeratorYDisplayStyle = axisHeight - maxTextualDepth;
const numeratorYInlineStyle = numeratorYDisplayStyle;

const denominatorYDisplayStyle = axisHeight - maxTextualHeight;
const denominatorYInlineStyle = denominatorYDisplayStyle;

const horizontalPadding = 0.12;

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
	validateProperties({
		numerator: "object",
		denominator: "object"
	})(fraction);
	
	const { style } = fraction;
	const { fontSize } = style;
	const isDisplay = isDisplayStyle(style);
	const subStyle = incrementStyle(style);
	let num: BoxNode = pipe(withStyle(subStyle), layoutNode)(fraction.numerator);
	let denom: BoxNode = pipe(withStyle({ ...subStyle, cramped: true }), layoutNode)(fraction.denominator);

	const ruleThickness = getRuleThickness(subStyle);
	const halfRuleThickness = ruleThickness / 2;
	const minSpacing = (isDisplay ? 3 : 1) * ruleThickness;

	const axisHeight = getAxisHeight(style);

	const numeratorY = calculateNumeratorPositionY(num, fontSize, isDisplay, axisHeight + halfRuleThickness + minSpacing);
	const denomY = calculateDenominatorPositionY(denom, fontSize, isDisplay, axisHeight - halfRuleThickness - minSpacing);

	//calculate width and center items horizontally
	const maxWidth = max([num, denom].map(n => n.dimensions.width));
	const width = maxWidth + (2 * horizontalPadding * style.fontSize);
	const middleXs = [num, denom].map(n => calcCentering(n.dimensions.width, width));

	num = setPosition([middleXs[0], numeratorY])(num);
	denom = setPosition([middleXs[1], denomY])(denom);

	const dimensions = {
		width,
		yMax: boxTop(num),
		yMin: boxBottom(denom)
	};

	return {
		type: "fraction", style,
		numerator: num,
		denominator: denom,
		rule: {
			type: "rule",
			position: [0, axisHeight],
			dimensions: {
				width: dimensions.width,
				yMax: halfRuleThickness,
				yMin: -halfRuleThickness
			}
		},
		dimensions
	};
};
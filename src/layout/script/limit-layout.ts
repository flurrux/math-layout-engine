
import { 
	ScriptNode as FormulaScriptNode, BoxNode, FormulaNode, Dimensions, Vector2, ScriptNode 
} from '../../types';
import { BoxScriptNode } from './script-layout';

import { smallerStyle, withStyle, Style } from "../../style";
import { layoutNode, layoutByMap } from "../layout";
import { 
	center, setPosition, calcBoundingDimensions, alignToYAxis
} from '../layout-util';

import { pipe, map, pick } from 'ramda';
import { valuesInObject } from '../../util/util';





const withLimitStyle = (scriptNode: ScriptNode) : ScriptNode => {
	return {
		...scriptNode,
		nucleus: {
			...scriptNode.nucleus,
			style: {
				...(scriptNode.nucleus.style || {}),
				fontFamily: "Size2"
			}
		}
	};
};

const layoutSupLim = (parentStyle: Style, supStyle: Style, nucleusDimensions: Dimensions) => ((sup: FormulaNode) : BoxNode => {
	const supLayouted : BoxNode = pipe(withStyle(supStyle), layoutNode)(sup);
	const supDim = supLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(supDim.width, nucleusDimensions.width),
		nucleusDimensions.yMax - supDim.yMin + spacing
	];
	return setPosition(position)(supLayouted);
});
const layoutSubLim = (parentStyle: Style, subStyle: Style, nucleusDimensions: Dimensions) => ((sub: FormulaNode) : BoxNode => {
	const subLayouted = pipe(withStyle(subStyle), layoutNode)(sub);
	const subDim = subLayouted.dimensions;
	const spacing = parentStyle.fontSize * 0.2;
	const position : Vector2 = [
		center(subDim.width, nucleusDimensions.width),
		nucleusDimensions.yMin - subDim.yMax - spacing
	];
	return setPosition(position)(subLayouted);
});

export const layoutScriptInLimitPosition = (script: FormulaScriptNode) : BoxScriptNode => {
    script = withLimitStyle(script);
	const { style } = script;
	const nucleusLayouted : BoxNode = pipe(
		withStyle(style), layoutNode, setPosition([0, 0])
	)(script.nucleus);
	const nucleusDim = nucleusLayouted.dimensions;

	const scriptStyle = smallerStyle(style);
	const scriptLayouted = pipe(alignToYAxis)({
		nucleus: nucleusLayouted,
		...pipe(
			pick(["sup", "sub"]),
			layoutByMap({
				sup: layoutSupLim(style, scriptStyle, nucleusDim),
				sub: layoutSubLim(style, scriptStyle, nucleusDim)
			})
		)(script)
	});
	const dimensions = calcBoundingDimensions(scriptLayouted);
	return {
		type: "script",
		style, dimensions,
		...scriptLayouted
	};
};
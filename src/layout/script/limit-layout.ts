
import { pick, pipe } from 'ramda';
import { smallerStyle, Style, withStyle } from "../../style";
import { BoxNode, Dimensions, FormulaNode, ScriptNode as FormulaScriptNode, ScriptNode, Vector2 } from '../../types';
import { layoutByMap, layoutNode } from "../layout";
import { alignToYAxis, calcBoundingDimensions, center, setPosition } from '../layout-util';
import { BoxScriptNode } from './script-layout';






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
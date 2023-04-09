import { BoxNode } from '../types';
import { renderBoxNode } from './render-box-node';


export const renderFormulaLayout = (ctx: CanvasRenderingContext2D, formulaLayout: BoxNode) => {
	const { canvas } = ctx;
	ctx.save();
	ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
	renderBoxNode(ctx, formulaLayout);
	ctx.restore();
};
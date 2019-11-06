import { pickList, isDefined, addFontFaces } from '../util';
import { fontIdentifiers } from '../font-data/katex-font-util';
import { pathContours } from '../opentype-util';
import { BoxNode, Style } from '../types';
import { BoxCharNode } from '../layout/char-layout';
import { BoxTextNode } from '../layout/text-layout';

export const loadKatexFontFaces = async () => {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const katexPrefix = "KaTeX_";
	const fontUrlMap : { [fontKey: string]: string } = fontIdentifiers.reduce((urlMap, key) => Object.assign(urlMap, { 
		[katexPrefix + key]: `${baseUrl}${katexPrefix}${key}.ttf`
	}), {});
	await addFontFaces(fontUrlMap);
};


// const renderAxisLine = (ctx: CanvasRenderingContext2D, node: BoxNode) => {
// 	ctx.save();
// 	ctx.beginPath();
// 	const axisHeight = getAxisHeight(node.style);
// 	ctx.translate(0, axisHeight);
// 	ctx.moveTo(0, 0);
// 	ctx.lineTo(node.width, 0);
// 	ctx.setTransform(1, 0, 0, 1, 0, 0);
// 	Object.assign(ctx, { lineWidth: 1, strokeStyle: "red" });
// 	ctx.stroke();
// 	ctx.restore();
// };
const renderBoundingBox = (ctx: CanvasRenderingContext2D, node: BoxNode) => {
	const dim = node.dimensions;
	const height = dim.yMax - dim.yMin;

	ctx.save();
	ctx.beginPath();
	ctx.rect(0, dim.yMin, dim.width, height);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(dim.width, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.stroke();
	ctx.restore();
};
const renderText = (ctx: CanvasRenderingContext2D, style: Style, text: string) => {
	ctx.save();
	ctx.font = `${style.fontSize}px KaTeX_${style.fontFamily}-${style.emphasis}`;
	ctx.scale(1, -1);
	ctx.fillText(text, 0, 0);
	ctx.restore();
};
const renderChar = (ctx: CanvasRenderingContext2D, node: BoxCharNode) => renderText(ctx, node.style, node.char);
const renderTextNode = (ctx: CanvasRenderingContext2D, node: BoxTextNode) => renderText(ctx, node.style, node.text);

const renderContours = (ctx: CanvasRenderingContext2D, node) => {
	ctx.save();
	const { fontSize } = node.style;
	ctx.scale(fontSize, fontSize);
	pathContours(ctx, node.contours);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.restore();
};
const renderFractionRule = (ctx: CanvasRenderingContext2D, width, thickness: number) => {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(width, 0);
	ctx.lineWidth = thickness;
	ctx.stroke();
};
const renderFraction = (ctx: CanvasRenderingContext2D, node) => {
	renderSubNodes(ctx, node, ["numerator", "denominator"]);
	renderFractionRule(ctx, node.dimensions.width, node.ruleThickness);
};
const renderSubNodes = (ctx: CanvasRenderingContext2D, node: BoxNode, props: string[]) => pickList(props, node)
	.filter(isDefined).forEach((subNode => renderNode(ctx, subNode)));

const renderNodes = (ctx: CanvasRenderingContext2D, nodes: BoxNode[]) => nodes.forEach(node => renderNode(ctx, node));
const renderNode = (ctx: CanvasRenderingContext2D, node: BoxNode) => {

	ctx.save();
	ctx.translate(...node.position);

	//renderBoundingBox(ctx, node);

	const nodeType = node.type;
	if (nodeType === "char") {
		renderChar(ctx, node as BoxCharNode);
	}
	else if (nodeType === "text") {
		renderTextNode(ctx, node as BoxTextNode);
	}
	else if (nodeType === "contours") {
		renderContours(ctx, node);
	}
	else if (nodeType === "mathlist") {
		renderNodes(ctx, (node as any).items as BoxNode[]);
	}
	else if (nodeType === "fraction") {
		renderFraction(ctx, node);
	}
	else if (nodeType === "script") {
		renderSubNodes(ctx, node, ["nucleus", "sup", "sub"]);
	}
	else if (nodeType === "root") {
		renderSubNodes(ctx, node, ["radical", "radicand", "index"]);
	}
	else if (nodeType === "matrix"){
		renderNodes(ctx, (node as any).items as BoxNode[]);
	}
	else if (nodeType === "accented"){
		renderSubNodes(ctx, node, ["nucleus", "accent"]);
	}

	ctx.restore();
};
export const centerNodeOnCanvas = (canvas: HTMLCanvasElement, node: BoxNode) => {
	return {
		...node,
		position: [
			(canvas.width - node.dimensions.width) / 2,
			(canvas.height - node.dimensions.yMax - node.dimensions.yMin) / 2
		]
	}
};
export const renderFormulaLayout = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, formulaLayout: BoxNode) => {
	ctx.save();
	Object.assign(ctx, { fillStyle: "black", strokeStyle: "black" });

	ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
	renderNode(ctx, formulaLayout);
	ctx.restore();
};
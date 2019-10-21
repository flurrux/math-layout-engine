import { pickList, isDefined } from '../util.js';
import { fontIdentifiers } from '../font-data/katex-font-util.js';
import { pathContours } from '../opentype-util.js';

export const loadKatexFontFaces = async () => {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const katexPrefix = "KaTeX_";
	const fontUrlMap = fontIdentifiers.reduce((urlMap, key) => Object.assign(urlMap, { 
		[katexPrefix + key]: `${baseUrl}${key}.ttf`
	}), {});
	await addFontFaces(fontUrlMap);
};


const renderAxisLine = (ctx, node) => {
	ctx.save();
	ctx.beginPath();
	const axisHeight = getAxisHeight(node.style);
	ctx.translate(0, axisHeight);
	ctx.moveTo(0, 0);
	ctx.lineTo(node.width, 0);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	Object.assign(ctx, { lineWidth: 1, strokeStyle: "red" });
	ctx.stroke();
	ctx.restore();
};
const renderBoundingBox = (ctx, node) => {
	const dim = node.dimensions;
	const height = dim.yMax - dim.yMin;

	ctx.save();
	ctx.beginPath();
	ctx.rect(0, -dim.yMax, dim.width, height);
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
const renderChar = (ctx, node) => {
	const style = node.style;
	ctx.font = `${style.fontSize}px ${style.fontName}`;
	ctx.fillText(node.char, 0, 0);
};
const renderContours = (ctx, node) => {
	ctx.save();
	const { fontSize } = node.style;
	ctx.scale(fontSize, -fontSize);
	pathContours(ctx, node.contours);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.restore();
};
const renderFractionRule = (ctx, width, thickness) => {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(width, 0);
	ctx.lineWidth = thickness;
	ctx.stroke();
};
const renderFraction = (ctx, node) => {
	renderSubNodes(node, ["numerator", "denominator"]);
	renderFractionRule(ctx, node.dimensions.width, node.ruleThickness);
};
const renderSubNodes = (node, props) => pickList(props, node).filter(isDefined).forEach(renderNode);
const renderNode = (ctx, node) => {

	ctx.save();
	ctx.translate(...node.position);

	//renderBoundingBox(ctx, node);

	const nodeType = node.type;
	if (nodeType === "char") {
		renderChar(ctx, node);
	}
	else if (nodeType === "contours") {
		renderContours(ctx, node);
	}
	else if (nodeType === "mathlist") {
		node.items.forEach(renderNode);
	}
	else if (nodeType === "fraction") {
		renderFraction(ctx, node);
	}
	else if (nodeType === "script") {
		renderSubNodes(node, ["nucleus", "sup", "sub"]);
	}
	else if (nodeType === "root") {
		renderSubNodes(node, ["radical", "radicand", "index"]);
	}

	ctx.restore();
};
export const centerNodeOnCanvas = (canvas, node) => {
	return {
		...node,
		position: [
			(canvas.width - formulaLayout.dimensions.width) / 2,
			(canvas.height - formulaLayout.dimensions.yMax + formulaLayout.dimensions.yMin) / 2
		]
	}
};
export const renderFormulaLayout = (canvas, ctx, formulaLayout) => {
	ctx.save();
	Object.assign(ctx, { fillStyle: "black", strokeStyle: "black" });
	ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
	renderNode(formulaLayout);
	ctx.restore();
};
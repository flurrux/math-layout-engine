import { BoxCharNode } from '../layout/char-layout';
import { BoxMathListNode } from '../layout/mathlist-layout';
import { BoxMatrixNode } from '../layout/matrix-layout';
import { BoxTextNode } from '../layout/text-layout';
import { pathContours } from '../opentype';
import { Style } from '../style';
import { BoxNode, ContoursNode, RuleNode } from '../types';
import { isDefined, pickList } from '../util/util';

type Ctx = CanvasRenderingContext2D;

export const renderBoxNode = (ctx: Ctx, node: BoxNode) => {
	ctx.save();

	ctx.translate(...node.position);
	if (node.style && node.style.color) {
		const color = node.style.color;
		Object.assign(ctx, {
			strokeStyle: color,
			fillStyle: color
		});
	}

	renderByType(ctx, node);

	ctx.restore();
};



// const renderAxisLine = (ctx: Ctx, node: BoxNode) => {
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

const renderBoundingBox = (ctx: Ctx, node: BoxNode) => {
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
	const y = 0;//0.25 * (node.style.fontSize);
	ctx.moveTo(0, y);
	ctx.lineTo(dim.width, y);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "red";
	ctx.stroke();
	ctx.restore();
};

const renderText = (ctx: Ctx, style: Style, text: string) => {
	ctx.save();
	ctx.font = `${style.fontSize}px KaTeX_${style.fontFamily}-${style.emphasis}`;
	ctx.scale(1, -1);
	if (style.preventTextPixelSnapping) {
		//this rotation prevents vertical pixel-snapping, so animations run smoother
		ctx.rotate(0.0005);
	}
	ctx.fillText(text, 0, 0);
	ctx.restore();
};

const renderChar = (ctx: Ctx, node: BoxCharNode) => renderText(ctx, node.style, node.char);

const renderTextNode = (ctx: Ctx, node: BoxTextNode) => renderText(ctx, node.style, node.text);

const renderContours = (ctx: Ctx, node: ContoursNode) => {
	ctx.save();
	const { fontSize } = node.style;
	ctx.scale(fontSize, fontSize);
	pathContours(ctx, node.contours);
	ctx.fill();
	ctx.restore();
};

const renderRule = (ctx: Ctx, node: RuleNode) => {
	const thickness = node.dimensions.yMax - node.dimensions.yMin;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(node.dimensions.width, 0);
	ctx.lineWidth = thickness;
	ctx.stroke();
};

const renderSubNodes = (ctx: Ctx, node: BoxNode, props: string[]) => (
	pickList(props, node)
		.filter(isDefined)
		.forEach((subNode => renderBoxNode(ctx, subNode)))
);

const renderBoxNodes = (ctx: Ctx, nodes: BoxNode[]) => (
	nodes.forEach(node => renderBoxNode(ctx, node))
);


const renderByType = (ctx: Ctx, node: BoxNode) => {
	const nodeType = node.type;
	if (nodeType === "char") {
		renderChar(ctx, node as BoxCharNode);
	}
	else if (nodeType === "text") {
		renderTextNode(ctx, node as BoxTextNode);
	}
	else if (nodeType === "contours") {
		renderContours(ctx, node as ContoursNode);
	}
	else if (nodeType === "mathlist") {
		renderBoxNodes(ctx, (node as BoxMathListNode).items as BoxNode[]);
	}
	else if (nodeType === "fraction") {
		renderSubNodes(ctx, node, ["numerator", "rule", "denominator"]);
	}
	else if (nodeType === "rule") {
		renderRule(ctx, node as RuleNode);
	}
	else if (nodeType === "script") {
		renderSubNodes(ctx, node, ["nucleus", "sup", "sub"]);
	}
	else if (nodeType === "root") {
		renderSubNodes(ctx, node, ["radical", "radicand", "index"]);
	}
	else if (nodeType === "matrix") {
		renderBoxNodes(ctx, (node as BoxMatrixNode).items as BoxNode[]);
	}
	else if (nodeType === "accented") {
		renderSubNodes(ctx, node, ["nucleus", "accent"]);
	}
	else if (nodeType === "delimited") {
		renderSubNodes(ctx, node, ["delimited", "leftDelim", "rightDelim"]);
	}
}
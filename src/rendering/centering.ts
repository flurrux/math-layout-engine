import pipe from "ramda/src/pipe";
import { setPosition } from "../layout/layout-util";
import { BoxNode } from "../types";

const calculateCenterPosition = (canvas: HTMLCanvasElement, node: BoxNode): [number, number] => {
	return [
		(canvas.width - node.dimensions.width) / 2,
		(canvas.height - node.dimensions.yMax - node.dimensions.yMin) / 2
	];
};

export const centerBoxNodeOnCanvas = (canvas: HTMLCanvasElement) => (node: BoxNode): BoxNode => (
	setPosition(calculateCenterPosition(canvas, node))(node)
);
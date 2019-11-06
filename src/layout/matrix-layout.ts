import { layoutWithStyle } from "./layout";
import { setPosition, getAxisHeight, isNodeAlignedToBaseline } from './layout-util';
import { map, filter, range, pipe, pick, add, multiply, identity } from 'ramda';
import { sum, accumSum, max } from "../util";
import { BoxNode, MatrixNode as FormulaMatrixNode, FormulaNode, Vector2 } from "../types";


interface BoxMatrixNode extends BoxNode {
	items: BoxNode[],
	rowCount: number,
	colCount: number
}


const getPositionInMatrix = (colCount: number, flatIndex: number) => [Math.floor(flatIndex / colCount), flatIndex % colCount];

const partitionIntoCols = <T>(colCount: number) => ((array: T[]) : T[][] => array.reduce((cols: T[][], item: T, ind) => {
	const colInd = ind % cols.length;
	cols[colInd].push(item);
	return cols;
}, map(() => [], range(0, colCount))));

const partitionIntoRows = <T>(colCount: number) => ((array: T[]): T[][] => array.reduce((rows, item, ind) => {
	const rowInd = Math.floor(ind / colCount);
	rows[rowInd].push(item);
	return rows;
}, map(() => [], range(0, array.length / colCount))));

const calcOffsetY = (node: FormulaNode, layoutedNode: BoxNode) => isNodeAlignedToBaseline(node) ? 0 : getAxisHeight(layoutedNode.style);
interface HeightAndDepth {
	yMin: number, yMax: number
};
const heightOfNode = (node: BoxNode): HeightAndDepth => pick(["yMin", "yMax"], node.dimensions);
const widthOfNode = (node: BoxNode) => node.dimensions.width;
const maxHeightAndDepth = (heightsAndDepths: HeightAndDepth[]) => identity({
	yMin: Math.min(...heightsAndDepths.map(obj => obj.yMin)),
	yMax: Math.max(...heightsAndDepths.map(obj => obj.yMax)),
});

//every item is aligned to the baseline
export const layoutMatrix = (matrixNode: FormulaMatrixNode) : BoxMatrixNode => {
	const { style } = matrixNode;
	const { fontSize } = style;
	matrixNode = {
		rowSpacing: 0.1,
		colSpacing: 0.1,
		...matrixNode
	};
	const { rowCount, colCount, items } = matrixNode;
	let itemsLayouted: BoxNode[] = map(layoutWithStyle(style), items);

	const yOffsetMap = new Map();
	for (const [index, layoutItem] of itemsLayouted.entries()){
		yOffsetMap.set(layoutItem, calcOffsetY(items[index], layoutItem));
	}
	const colWidths: number[] = pipe(partitionIntoCols(colCount), map((col: BoxNode[]) => pipe(map(widthOfNode), max)(col)))(itemsLayouted);
	const rowDims: HeightAndDepth[] = pipe(
		partitionIntoRows(colCount), 
		map((row: BoxNode[]) => maxHeightAndDepth(map((item: BoxNode) => map(add(yOffsetMap.get(item)), heightOfNode(item)), row)))
	)(itemsLayouted);
	const rowAndColSpacing: { rowSpacing: number, colSpacing: number } = pipe(pick(["rowSpacing", "colSpacing"]), map(multiply(fontSize)))(matrixNode);
	const { rowSpacing, colSpacing } = rowAndColSpacing;
	const totalWidth = sum(colWidths) + (colCount - 1) * colSpacing;
	const totalHeight = sum(map(dim => dim.yMax - dim.yMin)(rowDims)) + (rowCount - 1) * rowSpacing;
	const halfHeight = totalHeight / 2;
	const colPositions: number[] = pipe(map(add(colSpacing)), accumSum)(colWidths);
	const rowPositions: number[] = rowDims.reduce((posArr, rowDim, rowInd) => {
		if (rowInd === colCount - 1) return posArr;
		const lastVal = posArr[posArr.length - 1];
		const [curDim, nextDim] = [rowDim, rowDims[rowInd + 1]];
		const descend = curDim.yMin - rowSpacing - nextDim.yMax;
		posArr.push(lastVal + descend);
		return posArr;
	}, [halfHeight - rowDims[0].yMax]);

	itemsLayouted = itemsLayouted.map((layoutedItem, index) => {
		const [rowIndex, colIndex] = getPositionInMatrix(colCount, index);
		return setPosition([
			colPositions[colIndex], 
			rowPositions[rowIndex] + yOffsetMap.get(layoutedItem) 
		])(layoutedItem);
	});

	const dimensions = {
		width: totalWidth,
		yMin: -halfHeight,
		yMax: halfHeight
	};

	return {
		type: "matrix",
		rowCount, colCount,
		dimensions, style,
		items: itemsLayouted
	};
}
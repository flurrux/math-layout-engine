import { layoutWithStyle } from "./layout";
import { setPosition, getAxisHeight, isNodeAlignedToBaseline } from './layout-util';
import { map, filter, range, pipe, pick, add, multiply, identity } from 'ramda';
import { sum, accumSum } from "../util";

const lookUpMatrixItem = (array, colCount, row, col) => array[row * colCount + col];

const lookUpColItems = (colCount, colIndex, array) => filter((obj, ind) => ind % colCount === colIndex)(array);
const lookUpRowItems = (colCount, rowIndex, array) => filter((obj, ind) => Math.floor(ind / colCount) === rowIndex)(array);
const getPositionInMatrix = (colCount, flatIndex) => [Math.floor(flatIndex / colCount), flatIndex % colCount];

const partitionIntoCols = (colCount) => (array => array.reduce((cols, item, ind) => {
	const colInd = ind % cols.length;
	cols[colInd].push(item);
	return cols;
}, map(() => [], range(0, colCount))));
const partitionIntoRows = (colCount) => (array => array.reduce((rows, item, ind) => {
	const rowInd = Math.floor(ind / colCount);
	rows[rowInd].push(item);
	return rows;
}, map(() => [], range(0, array.length / colCount))));

const calcOffsetY = (node, layoutedNode) => isNodeAlignedToBaseline(node) ? 0 : getAxisHeight(layoutedNode.style);
const heightOfNode = node => pick(["yMin", "yMax"], node.dimensions);
const widthOfNode = node => node.dimensions.width;
const max = array => Math.max(...array);
const maxHeightAndDepth = heightsAndDepths => identity({
	yMin: Math.min(...heightsAndDepths.map(obj => obj.yMin)),
	yMax: Math.max(...heightsAndDepths.map(obj => obj.yMax)),
});

//every item is aligned to the baseline
export const layoutMatrix = (matrixNode) => {
	const { style } = matrixNode;
	const { fontSize } = style;
	matrixNode = {
		rowSpacing: 0.1,
		colSpacing: 0.1,
		...matrixNode
	};
	const { rowCount, colCount, items } = matrixNode;
	let itemsLayouted = map(layoutWithStyle(style), items);

	const yOffsetMap = new Map();
	for (const [index, layoutItem] of itemsLayouted.entries()){
		yOffsetMap.set(layoutItem, calcOffsetY(items[index], layoutItem));
	}
	const colWidths = pipe(partitionIntoCols(colCount), map(col => pipe(map(widthOfNode), max)(col)))(itemsLayouted);
	const rowDims = pipe(
		partitionIntoRows(colCount), 
		map(row => maxHeightAndDepth(map(item => map(add(yOffsetMap.get(item)), heightOfNode(item)), row)))
	)(itemsLayouted);
	const { rowSpacing, colSpacing } = pipe(pick(["rowSpacing", "colSpacing"]), map(multiply(fontSize)))(matrixNode);
	const totalWidth = sum(colWidths) + (colCount - 1) * colSpacing;
	const totalHeight = sum(map(dim => dim.yMax - dim.yMin)(rowDims)) + (rowCount - 1) * rowSpacing;
	const halfHeight = totalHeight / 2;
	const colPositions = pipe(map(add(colSpacing)), accumSum)(colWidths);
	const rowPositions = rowDims.reduce((posArr, rowDim, rowInd) => {
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
		], layoutedItem);
	});

	const dimensions = {
		width: totalWidth,
		yMin: -halfHeight,
		yMax: halfHeight
	};

	return {
		type: "matrix",
		dimensions, style,
		items: itemsLayouted
	};
}
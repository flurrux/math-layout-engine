import { layoutWithStyle, isNodeAlignedToBaseline, getAxisHeight } from "./layout";
import { map, filter, range, pipe, pick } from 'ramda';
import { identity, sum } from "./util";

const lookUpMatrixItem = (array, colCount, row, col) => array[row * colCount + col];

const lookUpColItems = (colCount, colIndex, array) => filter((obj, ind) => ind % colCount === colIndex)(array);
const lookUpRowItems = (colCount, rowIndex, array) => filter((obj, ind) => Math.floor(ind / colCount) === rowIndex)(array);

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

const heightOfNode = node => {
	const offsetY = isNodeAlignedToBaseline(node) ? 0 : getAxisHeight(node.style);
	return pipe(pick(["yMin", "yMax"]), map(val => val + offsetY))(node.dimensions);
};
const widthOfNode = nod => node.width;
const max = array => Math.max(...array);
const maxHeightAndDepth = heightsAndDepths => identity({
	yMin: Math.min(...heightsAndDepths.map(obj => obj.yMin)),
	yMax: Math.max(...heightsAndDepths.map(obj => obj.yMax)),
});

//every item is aligned to the baseline
const layoutMatrix = (matrixNode) => {
	const { style } = matrixNode;
	const { fontSize } = style;
	matrixNode = {
		rowSpacing: fontSize * 0.1,
		colSpacing: fontSize * 0.1,
		...matrixNode
	};
	
	const { rowCount, colCount, items } = matrixNode;
	const itemsLayouted = map(layoutWithStyle(style), items);

	const colWidths = pipe(partitionIntoCols(colCount), map(col => pipe(map(widthOfNode), max)(col)), max)(itemsLayouted);
	const rowHeightsAndDepths = pipe(partitionIntoRows(colCount), map(row => pipe(map(heightOfNode), maxHeightAndDepth)(row)), max)(itemsLayouted);

	const { rowSpacing, colSpacing } = matrixNode;
	const totalWidth = sum(colWidths) + (colCount - 1) * colSpacing;
	const totalHeight = sum(map(dim => dim.yMax - dim.yMin)(rowHeightsAndDepths)) + (rowCount - 1) * rowSpacing;
	const halfHeight = totalHeight / 2;

	
};
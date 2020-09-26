import { add, identity, map, multiply, pick, pipe, range, partial } from 'ramda';
import { BoxNode, MatrixNode as FormulaMatrixNode, MatrixStyle } from "../types";
import { accumSum, max, sum } from "../util/util";
import { layoutDelimited } from './delimiter/delimited-layout';
import { validateProperties } from "./error";
import { layoutWithStyle } from "./layout";
import { setPosition, getAxisHeight } from './layout-util';


export interface BoxMatrixNode extends BoxNode {
	type: "matrix",
	items: BoxNode[],
	rowCount: number,
	colCount: number,
};


const getPositionInMatrix = (colCount: number, flatIndex: number) => {
	return [
		Math.floor(flatIndex / colCount), 
		flatIndex % colCount
	];
};

const partitionIntoCols = <T>(colCount: number, array: T[]): T[][] => {
	return array.reduce(
		(cols: T[][], item: T, ind) => {
			const colInd = ind % cols.length;
			cols[colInd].push(item);
			return cols;
		}, 
		map(() => [], range(0, colCount))
	);
};

const partitionIntoRows = <T>(colCount: number, array: T[]): T[][] => {
	return array.reduce(
		(rows, item, ind) => {
			const rowInd = Math.floor(ind / colCount);
			rows[rowInd].push(item);
			return rows;
		}, 
		map(() => [], range(0, array.length / colCount))
	);
};



interface HeightAndDepth {
	yMin: number, yMax: number
};
const heightOfNode = (node: BoxNode): HeightAndDepth => pick(["yMin", "yMax"], node.dimensions);
const widthOfNode = (node: BoxNode) => node.dimensions.width;
const maxHeightAndDepth = (heightsAndDepths: HeightAndDepth[]) => identity({
	yMin: Math.min(...heightsAndDepths.map(obj => obj.yMin)),
	yMax: Math.max(...heightsAndDepths.map(obj => obj.yMax)),
});

const calculateXOffsetByAlignment = (alignment: "left" | "right" | "center", availableSpace: number): number => {
	if (alignment === "left"){
		return 0;
	}
	if (alignment === "center"){
		return availableSpace / 2;
	}
	if (alignment === "right"){
		return availableSpace;
	}
};

const alignItems = (
	colCount: number, colPositions: number[], 
	rowPositions: number[], colWidths: number[], 
	style: MatrixStyle, items: BoxNode[], ) => {
	
	return map(
		(index: number) => {
			const item = items[index];
			const [rowIndex, colIndex] = getPositionInMatrix(colCount, index);
			return setPosition([
				colPositions[colIndex] + calculateXOffsetByAlignment(
					style.horizontalAlignment, colWidths[colIndex] - item.dimensions.width
				),
				rowPositions[rowIndex]
			])(item);
		}
	)(range(0, items.length));
};

const defaultMatrixStyle: Partial<MatrixStyle> = {
	colSpacing: 0.3,
	rowSpacing: 0.3,
	horizontalAlignment: "center"
};

//every item is aligned to the baseline
export const layoutMatrix = (matrixNode: FormulaMatrixNode) : BoxMatrixNode => {
	validateProperties({
		rowCount: "number", 
		colCount: "number",
		items: "array"
	});
	if (matrixNode.rowCount * matrixNode.colCount !== matrixNode.items.length){
		throw `the number of matrix-items (${matrixNode.items.length}) does not match rowCount * colCount (${matrixNode.rowCount * matrixNode.colCount})`
	}

	const style = {
		...defaultMatrixStyle,
		...matrixNode.style
	};
	const spacings: { colSpacing: number, rowSpacing: number } = pick(["rowSpacing", "colSpacing"], style);
	const { fontSize } = style;
	const { rowCount, colCount, items } = matrixNode;
	let itemsLayouted: BoxNode[] = map(layoutWithStyle(style), items);
	
	const colWidths: number[] = pipe(
		partial(partitionIntoCols, [colCount]), 
		map(
			(col: BoxNode[]) => pipe(
				map(widthOfNode), 
				max
			)(col)
		)
	)(itemsLayouted);
	
	const rowDims: HeightAndDepth[] = pipe(
		partial(partitionIntoRows, [colCount]), 
		map(
			(row: BoxNode[]) => maxHeightAndDepth(
				map((item: BoxNode) => heightOfNode(item), row)
			)
		)
	)(itemsLayouted);

	const rowAndColSpacing: { rowSpacing: number, colSpacing: number } = pipe(
		pick(["rowSpacing", "colSpacing"]), 
		map(multiply(fontSize))
	)(spacings);

	const { rowSpacing, colSpacing } = rowAndColSpacing;
	const totalWidth = sum(colWidths) + (colCount - 1) * colSpacing;
	const totalHeight = sum(map(dim => dim.yMax - dim.yMin)(rowDims)) + (rowCount - 1) * rowSpacing;
	const halfHeight = totalHeight / 2;
	const topY = halfHeight + getAxisHeight(style);
	const colPositions: number[] = pipe(map(add(colSpacing)), accumSum)(colWidths);
	const rowPositions: number[] = rowDims.reduce(
		(posArr, rowDim, rowInd) => {
			if (rowInd === rowCount - 1) return posArr;
			const lastVal = posArr[posArr.length - 1];
			const [curDim, nextDim] = [rowDim, rowDims[rowInd + 1]];
			const descend = curDim.yMin - rowSpacing - nextDim.yMax;
			posArr.push(lastVal + descend);
			return posArr;
		}, 
		[topY - rowDims[0].yMax]
	);

	itemsLayouted = alignItems(colCount, colPositions, rowPositions, colWidths, style, itemsLayouted);

	const dimensions = {
		width: totalWidth,
		yMin: topY - totalHeight,
		yMax: topY
	};

	return {
		type: "matrix",
		rowCount, colCount,
		dimensions, style,
		items: itemsLayouted
	};
}
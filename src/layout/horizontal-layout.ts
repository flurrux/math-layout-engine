import { compositeTypes, glyphTypes } from "../node-types";
import { FormulaNode } from '../types';

const nodeSpacingTable: number[][] = [
	[0, 1, 2, 3, 2, 0, 0, 1],
	[1, 1, 0, 3, 0, 0, 0, 1],
	[2, 2, 0, 0, 2, 0, 0, 2],
	[3, 3, 0, 0, 3, 0, 0, 3],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 3, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 1, 1],
	[1, 1, 2, 3, 1, 0, 1, 1]
];
const getIndexOfNodeType = (type: string): number => compositeTypes.includes(type) ? 7 : glyphTypes.indexOf(type);
const typeOfNode = (node: FormulaNode): string => node.type;

//the horizontal spacing between two nodes depends on their respective types
export const lookUpHorizontalSpacing = (node1: FormulaNode, node2: FormulaNode): number => {
	const [ind1, ind2] = [node1, node2].map(typeOfNode).map(getIndexOfNodeType);
	if (ind1 < 0 || ind2 < 0) {
		return 0;
	}
	return 2 * nodeSpacingTable[ind1][ind2] / 18;
};
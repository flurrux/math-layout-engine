import { layoutNode } from "./layout";
import { calcBoundingDimensions } from './layout-util';
import { lookUpHorizontalSpacing } from "./horizontal-layout";
import { map, pipe } from 'ramda';
import { withStyle } from "../style";
import { FormulaNode, MathListNode, BoxNode } from '../types';
import { Style } from '../style';
import { WrongPropertyTypeError, validateProperties } from './error';

export interface BoxMathListNode extends BoxNode {
	items: BoxNode[]
};

const calculateHorizontalSpacing = (style: Style, index: number, itemCount: number, node1: FormulaNode, node2: FormulaNode) : number => {
	return (index >= itemCount - 1 || ["S", "SS"].includes(style.type)) ? 0 : lookUpHorizontalSpacing(node1, node2) * style.fontSize;
};
export const layoutMathList = (mathList: MathListNode) : BoxMathListNode => {
	validateProperties({
		items: "array"
	})(mathList);
	
	const { items } = mathList;
	const { style } = mathList;
	const layoutItems : BoxNode[] = map(pipe(withStyle(style), layoutNode))(items);

	let curX = 0;
	const positions: [number, number][] = [];
	for (let i = 0; i < items.length; i++) {
		const layoutItem = layoutItems[i];

		positions.push([curX, 0]);
		curX += layoutItem.dimensions.width;

		//spacing
		curX += calculateHorizontalSpacing(style, i, items.length, items[i], items[i + 1]);
	}

	const positionedItems : BoxNode[] = layoutItems.map((layoutItem, index) => {
		return { ...layoutItem, position: positions[index] }
	});

	return {
		type: "mathlist",
		style,
		dimensions: calcBoundingDimensions(positionedItems),
		items: positionedItems
	};
};
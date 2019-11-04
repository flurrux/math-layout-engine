import { layoutNode, getAxisAlignment } from "./layout";
import { calcBoundingDimensions } from './layout-util';
import { lookUpHorizontalSpacing } from "./horizontal-layout";
import { map, pipe } from 'ramda';
import { withStyle } from "../style";

const calculateHorizontalSpacing = (style, index, itemCount, node1, node2) => {
	return (index >= itemCount - 1 || ["S", "SS"].includes(style.type)) ? 0 : lookUpHorizontalSpacing(node1, node2) * style.fontSize;
};
export const layoutMathList = (mathList) => {
	const items = mathList.items;
	const { style } = mathList;
	const layoutItems = map(pipe(withStyle(style), layoutNode))(items);

	let curX = 0;
	const positions = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const layoutItem = layoutItems[i];
		const y = getAxisAlignment(style, item);

		positions.push([curX, y]);
		curX += layoutItem.dimensions.width;

		//spacing
		curX += calculateHorizontalSpacing(style, i, items.length, items[i], items[i + 1]);
	}

	const positionedItems = layoutItems.map((layoutItem, index) => {
		return { ...layoutItem, position: positions[index] }
	});

	return {
		type: "mathlist",
		dimensions: calcBoundingDimensions(positionedItems),
		items: positionedItems
	};
};
import { layoutNode, getAxisAlignment, calcBoundingDimensions } from "./layout";
import { lookUpHorizontalSpacing } from "./horizontal-layout";
import { map, pipe } from 'ramda';
import { withStyle } from "./style";

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
		if (i < items.length - 1) {
			curX += lookUpHorizontalSpacing(items[i], items[i + 1]) * style.fontSize;
		}
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
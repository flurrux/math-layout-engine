

export interface FormulaNode {
    type: string,
    style?: object
};

export interface BoxNode {
	type: string,
	position?: [number, number],
	dimensions: {
		width: number,
		yMin: number,
		yMax: number
	},
	style?: object
};
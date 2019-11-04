

export interface Style {
	fontSize: number,
	emphasis?: string,
	fontFamily?: string
};

export interface Dimensions {
	width: number, 
	yMin: number,
	yMax: number
};

export interface BoundingBox {
	xMin: number,
	yMin: number,
	xMax: number,
	yMax: number
};

export interface FormulaNode {
    type: string,
    style?: Style
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

export interface Vector2 {
	[0]: number,
	[1]: number
};

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

export interface TextualNode extends FormulaNode {
	value?: string,
	text?: string
};
export interface CharNode extends FormulaNode {
	value?: string
};
export interface TextNode extends FormulaNode {
	text?: string
};
export interface RootNode extends FormulaNode {
	radicand: FormulaNode,
	index?: FormulaNode
};

export interface MathListNode extends FormulaNode {
	items: FormulaNode[]
};
export interface FractionNode extends FormulaNode {
	numerator: FormulaNode,
	denominator: FormulaNode
};



export interface BoxNode {
	type: string,
	position?: [number, number],
	dimensions: Dimensions,
	style?: Style
};

interface GlyphPoint {
	x: number,
	y: number,
	onCurve: boolean,
	[key: string]: any
}
export interface BoxContoursNode extends BoxNode {
	contours: GlyphPoint[][]
}
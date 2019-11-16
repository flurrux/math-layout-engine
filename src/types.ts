
import { Style } from './style';
import { Contour } from './opentype';

export interface Vector2 {
	[0]: number,
	[1]: number
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




//formula nodes ###

export interface FormulaNode {
	type: "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct" 
		| "mathlist" | "fraction" | "root" | "script" | "delimited" | "accented",
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

export interface MatrixNode extends FormulaNode {
	rowCount: number,
	colCount: number,
	items: FormulaNode[],

	//move to style?
	rowSpacing?: number,
	colSpacing?: number
};

export interface DelimitedNode extends FormulaNode {
	leftDelim: FormulaNode,
	rightDelim: FormulaNode,
	delimited: FormulaNode
};

export interface ScriptNode extends FormulaNode {
	nucleus: FormulaNode,
	sup?: FormulaNode,
	sub?: FormulaNode
};




export interface BoxNode {
	type: string,
	position?: [number, number],
	dimensions: Dimensions,
	style?: Style
};

export interface ContoursNode extends BoxNode {
	contours: Contour[]
};
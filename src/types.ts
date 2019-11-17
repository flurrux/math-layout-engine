
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

type TextualType = "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct";
type CompositeType = "mathlist" | "fraction" | "root" | "script" | "delimited" | "accented" | "matrix";
type FormulaNodeType = TextualType | CompositeType;

export interface FormulaNode {
	type: FormulaNodeType,
    style?: Style
};

export interface TextualNode extends FormulaNode {
	type: TextualType,
	value?: string,
	text?: string
};
export interface CharNode extends FormulaNode {
	type: TextualType,
	value: string
};
export interface TextNode extends FormulaNode {
	type: "ord" | "op",
	text: string
};
export interface RootNode extends FormulaNode {
	type: "root",
	radicand: FormulaNode,
	index?: FormulaNode
};

export interface MathListNode extends FormulaNode {
	type: "mathlist",
	items: FormulaNode[]
};
export interface FractionNode extends FormulaNode {
	type: "fraction",
	numerator: FormulaNode,
	denominator: FormulaNode
};

export interface MatrixNode extends FormulaNode {
	type: "matrix",
	rowCount: number,
	colCount: number,
	items: FormulaNode[],

	//move to style?
	rowSpacing?: number,
	colSpacing?: number
};

export interface DelimitedNode extends FormulaNode {
	type: "delimited",
	leftDelim: FormulaNode,
	rightDelim: FormulaNode,
	delimited: FormulaNode
};

export interface ScriptNode extends FormulaNode {
	type: "script",
	nucleus: FormulaNode,
	sup?: FormulaNode,
	sub?: FormulaNode
};



//box types #####

type BoxTextualType = "char" | "text";
type BoxNodeType = BoxTextualType | CompositeType | "contours" | "rule";

export interface BoxNode {
	type: BoxNodeType,
	position?: [number, number],
	dimensions: Dimensions,
	style?: Style
};

export interface ContoursNode extends BoxNode {
	type: "contours",
	contours: Contour[]
};

export interface RuleNode extends BoxNode {
	type: "rule"
};

import { html } from 'lit-html';
import { codeAndRender } from '../util/formula-and-render';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';

export default pageAnchor("matrix", html`

${markdown(`
	### matrix
	-----------
`)}

${typeView(`
	interface MatrixStyle extends Style {
		rowSpacing: number,
		colSpacing: number
	}
	interface MatrixNode extends FormulaNode {
		type: "matrix",
		style: MatrixStyle,
		rowCount: number,
		colCount: number,
		items: FormulaNode[]
	}
`, `
	interface BoxMatrixNode extends BoxNode {
		type: "matrix",
		items: BoxNode[],
		rowCount: number,
		colCount: number
	}
`)}

${markdown(`
	**rowCount** is the number of rows of this matrix.  
	**colCount** is the number of columns of this matrix.  
	the number of items must be rowCount * colCount.  
	
	the default horizontal alignment is at the end of a cell.  
	there are no options to override or control alignment yet.
`)}

${codeAndRender(`
	{
		"type": "delimited",
		"leftDelim": { "type": "open", "value": "[" },
		"rightDelim": { "type": "close", "value": "]" },
		"delimited": {
			"type": "matrix",
			"rowCount": 2,
			"colCount": 3,
			"style": {
				"rowSpacing": 0.4,
				"colSpacing": 0.4
			},
			"items": [
				{ "type": "ord", "text": "20" },
				{ "type": "ord", "text": "0" },
				{ "type": "ord", "text": "63" },
				{ "type": "ord", "text": "200" },
				{ "type": "ord", "text": "93" },
				{ "type": "ord", "text": "5" }
			]
		}
	}
`)}

`);
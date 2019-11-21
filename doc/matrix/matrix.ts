
import demoImg from './demo.png';

export default `

## matrix
----------


\`\`\`typescript
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

interface BoxMatrixNode extends BoxNode {
	type: "matrix",
	items: BoxNode[],
	rowCount: number,
	colCount: number
}
\`\`\`

**rowCount** is the number of rows of this matrix.  
**colCount** is the number of columns of this matrix.  
the number of items must be rowCount * colCount.  

the default horizontal alignment is at the end of a cell.  
there are no options to override or control alignment yet.

### example  

\`\`\`javascript
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
\`\`\`

![demo](${demoImg})


`;

import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import labeledDimensionsImg from './dimensions-labeled.png';

export default pageAnchor("style", html`

${markdown(`
	## BoxNode
	-----------
	`)}
	
${markdownCode(`
interface BoxNode {
	type: "char" | "text" | 
		"mathlist" | "fraction" | "root" | "script" | "delimited" | "accented" | "matrix" | 
		"contours" | "rule",

	position?: [number, number],
	dimensions: {
		width: number, 
		yMin: number,
		yMax: number
	},
	style?: Style
}
`, "typescript")}

${markdown(`
	BoxNodes are the layouted versions of FormulaNodes.  
	for almost every FormulaNode there is a corresponding BoxNode with a few exceptions.  

	the types "ord", "op", "bin", "rel", "open", "close" and "punct" become either "char" or "text".  
	the composite-types like "mathlist" or "script" all have a corresponding BoxNode that looks the same in most cases.  
	"contours" and "rule" are types that only appear as BoxNodes.  
	contours are used to draw shapes like the radical of a square-root or a dynmically sized delimiter.  
	a rule is a simple box that represents the line in a fraction.  

	position and style are optional because internally, subnodes are generally first layouted and then positioned. 
	so subnodes always have a position and so does every node in the final output-node.  
	todo: maybe write a new interface "PositionedBoxNode" or "UnpositionedBoxNode" to distinguish between those cases.  
`)}

<h3>dimensions</h3>
<div style="display: flex; flex-wrap: wrap; align-items: center;">
	<img src="${labeledDimensionsImg}" />
	${markdown(`
		- the red line sits on the text-baseline 
		- yMin is below the baseline if it's a negative number.  
		this is different than in tex, where it's below the baseline for positive values 
	`)}
</div>

`);
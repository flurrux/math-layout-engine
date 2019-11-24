
import vectorExampleImg from './demo.png';
import emptyDepthExample from './empty-depth-example.png';

import { html } from 'lit-html';
import { codeAndRender } from '../util/formula-and-render';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';

export default pageAnchor("delimiter", html`

${markdown(`
	## delimiter
	-------------
`)}

${typeView(`
	interface DelimitedNode extends FormulaNode {
		type: "delimited",
		leftDelim: FormulaNode,
		rightDelim: FormulaNode,
		delimited: FormulaNode
	}
`, `
	interface BoxDelimitedNode extends BoxNode {
		type: "delimited",
		delimited: BoxNode,
		leftDelim: ContoursNode,
		rightDelim: ContoursNode
	}
`)}

${markdown(`
	nodes like \`{ "type": "open", "value": "(" )}\` have a static size.  
	for delimiters with dynamic size, use DelimitedNode.

	these are all the possible delimiter-characters that can be used:  
	( ),  [ ],  ⟨ ⟩,  ⌈ ⌉,  ⌊ ⌋,  | |

	note that delimiters are centered on the axis (0.25) and sized in such a way to completely cover the enclosed nodes.  
	if a node has much more height than depth, the lower part of the delimiter will be empty.  
	![example](${emptyDepthExample})
`)}


${codeAndRender(`
	{
		"type": "delimited",
		"leftDelim": { "type": "open", "value": "(" },
		"rightDelim": { "type": "close", "value": ")" },
		"delimited": {
			"type": "matrix",
			"rowCount": 3,
			"colCount": 1,
			"style": { "rowSpacing": 0.4 },
			"items": [
				{ "type": "ord", "value": "3" },
				{ "type": "ord", "value": "1" },
				{ "type": "ord", "value": "7" }
			]
		}
	}
`)}

`);
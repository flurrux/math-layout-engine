
import labeledPartsImg from './script-labeled.png';

import { html } from 'lit-html';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import { typeView } from '../util/type-view';
import { codeAndRender } from '../util/formula-and-render';

export default pageAnchor("script", html`

${markdown(`
	## script  
	----------
	
	this algorithm was implemented as described in the texbook (page 445, number 18)
`)}

${typeView(`
	interface ScriptNode extends FormulaNode {
		type: "script",
		nucleus: FormulaNode,
		sup?: FormulaNode,
		sub?: FormulaNode
	}
`, `
	interface BoxScriptNode extends BoxNode {
		nucleus: BoxNode,
		sup?: BoxNode,
		sub?: BoxNode
	}
`)}

${markdown(`
	![labeled parts](${labeledPartsImg})

	**sup** is short for superscript  
	**sub** is short for subscript
	
	sometimes, sub- and superscript appear above/below the nucleus,  
	typically when the nucleus is a big operator like a sum or product, or with limits.  
`)}


<h3>example</h3>
${codeAndRender(`
	{
		"type": "script",
		"nucleus": { "type": "op", "text": "lim" },
		"sub": {
			"type": "mathlist",
			"items": [
				{ "type": "ord", "value": "x" },
				{ "type": "ord", "value": "->" },
				{ "type": "ord", "value": "infinity" }
			]
		}
	}
`)}

${codeAndRender(`
	{
		"type": "mathlist",
		"items": [
			{
				"type": "script",
				"nucleus": { "type": "op", "value": "integral" },
				"sup": { "type": "ord", "value": "1" },
				"sub": { "type": "ord", "value": "0" }
			},
			{
				"type": "script",
				"nucleus": { "type": "ord", "value": "i" },
				"sup": { "type": "ord", "value": "x" }
			},
			{ "type": "bin", "value": "*" },
			{ "type": "ord", "value": "d" },
			{ "type": "ord", "value": "x" }
		]
	}
`)}
`);
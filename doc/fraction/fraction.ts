
import { html } from 'lit-html';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import { typeView } from '../util/type-view';
import { codeAndRender } from '../util/formula-and-render';

import labeledParts from "./fraction-labeled.png"

export default pageAnchor("fraction", html`

${markdown(`
	## fraction
	------------

	this algorithm was implemented as described in the texbook (page 445, number 15)
`)}

${typeView(`
	interface FractionNode extends FormulaNode {
		type: "fraction",
		numerator: FormulaNode,
		denominator: FormulaNode
	}
`, `
	interface BoxFractionNode extends BoxNode {
		type: "fraction",
		numerator: BoxNode,
		denominator: BoxNode,
		rule: RuleNode
	}
	interface RuleNode extends BoxNode { 
		type: "rule" 
	}
`)}

${markdown(`
	![labeled parts](${labeledParts})
	
	the horizontal division-line in a fraction is called a rule and its width spans the entire BoxFractionNode.  
	the line itself is centered vertically.  
`)}


${codeAndRender(`
	{
		"type": "fraction",
		"numerator": { "type": "ord", "value": "μ" },
		"denominator": {
			"type": "mathlist",
			"items": [
				{ "type": "ord", "value": "1" },
				{ "type": "bin", "value": "+" },
				{
					"type": "fraction",
					"numerator": { "type": "ord", "value": "μ" },
					"denominator": { "type": "ord", "value": "beta" }
				}
			]
		}
	}
`)}
`);
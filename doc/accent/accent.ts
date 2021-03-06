

import { html } from 'lit-html';
import { codeAndRender } from '../util/formula-and-render';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';
import { charTableTemplate } from '../util/char-table';

export default pageAnchor("accent", html`

${markdown(`
	## accent
	----------
`)}

${typeView(`
	interface AccentNode extends FormulaNode {
		type: "accented",
		nucleus: FormulaNode,
		accent: CharNode
	}
`, `
	interface BoxAccentNode extends BoxNode {
		type: "accented"
		nucleus: BoxNode,
		accent: BoxCharNode
	}
`)}


${markdown(`
	for prime-accents, use superscript:
`)}
${codeAndRender(`
	{
		"type": "script",
		"nucleus": { "type": "ord", "value": "f" },
		"sup": { "type": "ord", "text": "′′" }
	}
`)}

${charTableTemplate("accent characters", [
	"ˉ", "˙", "¨", "~", 8407, 730, "^"
])}

<h3>example</h3>
${codeAndRender(`
	{ 
		"type": "mathlist",
		"style": { "fontFamily": "Main", "emphasis": "Regular" },
		"items": [
			{
				"type": "accented",
				"nucleus": { "type": "ord", "value": "v" },
				"accent": { "type": "ord", "value": "dot-accent" }
			},
			{ "type": "rel", "value": "=" },
			{
				"type": "fraction",
				"numerator": {
					"type": "accented",
					"nucleus": { "type": "ord", "value": "f" },
					"accent": { "type": "ord", "value": "vector" }
				},
				"denominator": { "type": "ord", "value": "m" }
			}
		]
	}
`)}

`);
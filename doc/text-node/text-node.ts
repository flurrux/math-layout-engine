
import { html } from 'lit-html';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import { typeView } from '../util/type-view';
import { codeAndRender } from '../util/formula-and-render';

export default pageAnchor("text", html`

${markdown(`
	## text
	------------
`)}

${typeView(`
	export interface TextNode extends FormulaNode {
		type: "ord" | "op",
		text: string
	}
`, `
	export interface BoxTextNode extends BoxNode {
		type: "text",
		text: string,
		style: Style
	}
`)}

${codeAndRender(`
	{
		"type": "mathlist",
		"items": [
			{ "type": "ord", "value": "pi" },
			{ "type": "rel", "value": "=" },
			{ "type": "op", "text": "asin" },
			{ "type": "open", "value": "(" },
			{ "type": "ord", "value": "1" },
			{ "type": "close", "value": ")" },
			{ "type": "rel", "value": "=" },
			{ "type": "ord", "text": "3.14159..." }
		]
	}
`)}

`);

import labeledPartsImg from './root-labeled.png';

import { html } from 'lit-html';
import { codeAndRender } from '../util/formula-and-render';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';

export default pageAnchor("root", html`

${markdown(`
	## root  
	--------
`)}

${typeView(`
	interface RootNode extends FormulaNode {
		type: "root",
		radicand: FormulaNode,
		index?: FormulaNode
	}
`, `
	interface BoxRootNode extends BoxNode {
		type: "root",
		radical: ContoursNode,
		radicand: BoxNode,
		index?: BoxNode
	}
`)}

<img src="${labeledPartsImg}" />

<h3>example</h3>
${codeAndRender(`
	{
		"type": "root",
		"radicand": {
			"type": "fraction",
			"numerator": { "type": "ord", "value": "1" },
			"denominator": { "type": "ord", "value": "e" }
		},
		"index": { "type": "ord", "text": "999" }
	}
`)}
`);
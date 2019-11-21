import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import './font-overview';
import './char-overview';

export default pageAnchor("fonts", html`

${markdown(`
	## fonts
	-----------------

	all of the fonts are taken from [katex](cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/).
`)}

<h3>font overview</h3>
<font-overview-table style="padding-bottom: 12px;"></font-overview-table>

<h3>glpyh overview</h3>
<char-overview-table></char-overview-table>

`);
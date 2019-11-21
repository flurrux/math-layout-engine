/*
const template = `
\`\`\`javascript
{
	type: "mathlist",
	items: [
		{ type: "ord", value: "a" },
		{ type: "bin", value: "*" },
		{ type: "open", value: "(" },
		{ type: "ord", value: "b" },
		{ type: "bin", value: "+" },
		{ type: "ord", value: "c" },
		{ type: "open", value: ")" }
	]
}
\`\`\`

\`\`\`javascript
{
	type: "mathlist",
	dimensions: { ... },
	items: [
		{
			type: "char",
			char: "a",
			style: { ... },
			dimensions: { ... },
			position: [0, 0]
		},
		...
	]
}
\`\`\`
`;
*/

import { html } from 'lit-html';
import '../elements/labeled-arrow';

import rendering from './rendering.png';
import { markdownCode } from '../util/lit-marked';

const fontSize = "1em";

export default html`
<div class="formula-to-rendering">
	${markdownCode(`
		{
			type: "mathlist",
			items: [
				{ type: "ord", value: "a" },
				{ type: "bin", value: "*" },
				{ type: "open", value: "(" },
				{ type: "ord", value: "b" },
				{ type: "bin", value: "+" },
				{ type: "ord", value: "c" },
				{ type: "open", value: ")" }
			]
		}
	`, "javascript", fontSize)}
	<labeled-arrow label="layout"></labeled-arrow>
	${markdownCode(`
	{
		type: "mathlist",
		dimensions: { ... },
		items: [
			{
				type: "char",
				char: "a",
				style: { ... },
				dimensions: { ... },
				position: [0, 0]
			},
			...
		]
	}
	`, "javascript", fontSize)}
	<labeled-arrow label="render"></labeled-arrow>
	<img src="${rendering}" />
</div>

`;
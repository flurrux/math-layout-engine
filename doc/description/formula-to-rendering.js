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

import '../util/labeled-arrow';

import rendering from './rendering.png';
import { markdownCode } from '../util/lit-marked';
import { LitElement, css, html } from 'lit-element';

class FormulaAndRenderingDescription extends LitElement {
	static get styles(){
		return css`
			.formula-to-rendering {
				display: flex; 
				flex-direction: column;
				align-items: center;
				max-width: 100%;
				overflow-x: auto;
			}
			.horizontal-arrow {
				display: none;
			}
			.vertical-arrow {
				display: block;
			}

			@media only screen and (min-width: 600px) {
				.formula-to-rendering {
					flex-direction: row;
				}
				.horizontal-arrow {
					display: block;
				}
				.vertical-arrow {
					display: none;
				}
			}
			.formula-to-rendering > * {
				padding: 0px 10px 0px 10px;
			}
		`;
	}
	render(){
		const fontSize = "1em";
		return html`
			<div>
				<style>
					
				</style>
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
					<labeled-arrow class="horizontal-arrow" label="layout" direction="horizontal"></labeled-arrow>
					<labeled-arrow class="vertical-arrow"" label="layout" direction="vertical"></labeled-arrow>
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
					<labeled-arrow class="horizontal-arrow" label="render" direction="horizontal"></labeled-arrow>
					<labeled-arrow class="vertical-arrow"" label="render" direction="vertical"></labeled-arrow>
					<img src="${rendering}" />
				</div>
			</div>
		`;
	}
}
customElements.define("formula-to-rendering-example", FormulaAndRenderingDescription);
import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';


export default pageAnchor("character", html`

${markdown(`
	## character
	------------
`)}

${typeView(`
	interface CharNode extends FormulaNode {
		type: "ord" | "op" | "bin" | "rel" | 
			"open" | "close" | "punct",
		value: string
	}
`, `
	interface BoxCharNode extends BoxNode {
		type: "char",
		char: string,
		unicode: number,
		style: Style,
		dimensions: Dimensions,
		bbox: BoundingBox
	}
`)}

<div>
	<style>
		.char-types-example-table {
			display: grid;
			grid-template-columns: max-content max-content max-content max-content;
			grid-row-gap: 8px;
			grid-column-gap: 5px;
			align-items: center;
		}
		.char-types-example-table > span:nth-child(4n+1) {
			font-weight: bold;
			margin-right: 8px;
		}
		.big-op {
			font-family: KaTeX_Size1-Regular;
		}
		.kat-main {
			font-family: KaTeX_Main-Regular;
		}
		.kat-math {
			font-family: KaTeX_Math-Italic;
			font-size: 22px;
		}

	</style>
	<h3>types</h3>
	<div class="char-types-example-table">
		<span>ord (ordinary)</span>
		<span class="kat-math">x</span>
		<span class="kat-math">f</span>
		<span class="kat-math">π</span>
	
		<span>op (operator)</span>
		<span class="big-op">∑</span>
		<span class="big-op">∏</span>
		<span class="kat-main">exp</span>

		<span>bin (binary)</span>
		<span class="kat-main">+</span>
		<span class="kat-main">⋅</span>
		<span class="kat-main">×</span>

		<span>rel (relational)</span>
		<span class="kat-main">=</span>
		<span class="kat-main">\<</span>
		<span class="kat-main">∈</span>

		<span>open</span>
		<span class="kat-main">(</span>
		<span class="kat-main">[</span>
		<span class="kat-main">⟨</span>

		<span>close</span>
		<span class="kat-main">)</span>
		<span class="kat-main">]</span>
		<span class="kat-main">⟩</span>

		<span>punct</span>
		<span class="kat-main">,</span>
		<span class="kat-main">;</span>
	</div>
</div>


${markdown(`
	### aliases
	
	chars can be specified by aliases, so you can write them out conveniently instead of copy-pasting.  
`)}
${markdownCode(`
	{ "type": "ord", "value": "pi" }
`, "javascript")}
${markdown(`is equivalent to`)}
${markdownCode(`
	{ "type": "ord", "value": "π" }
`, "javascript")}

${markdown(`
	the tables below list all the available characters by type, along with their aliases.
`)}

`);
import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';
import { charTableTemplate } from '../util/char-table';
import { range } from 'ramda';


const operatorsTable = charTableTemplate("op (operators)", [
	"∑", "∫", "∏",
	"⋁", "⋀", "⋂", "⋃"
]);
const binaryOperatorsTable = charTableTemplate("bin (binary operators)", [
	"+", "-", "±", "⋅", "÷", "×", "∘", "∖"
]);
const relationalTable = charTableTemplate("rel (relational)", [
	"=", "<", ">", "≤", "≥", "≪", "≫", "≈", "≡",
	57376, "∈", "∋", "⊂", "⊆"
]);
const openCloseTable = charTableTemplate("open & close", [
	")", "(", "[", "]", "{", "}",
	"⟨", "⟩", "⌈", "⌉", "⌊", "⌋", "|",
]);

const miscTable = charTableTemplate("misc", [
	"⟹","↦", "→", 8242, "∞", "⋯",
	78, 90, 81, 82, 67,
	305, 567, 8711, 8706, 248, 8501, 8463,
	945, 946, 947, 948, 1013, 950, 951, 952, 953, 
	954, 955, 956, 957, 958, 959, 960, 961, 962, 
	963, 964, 965, 966, 967, 968, 969
]);

const typeExampleTemplate = html`
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
`;

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
	interface BoundingBox {
		xMin: number, 
		yMin: number,
		xMax: number,
		yMax: number
	}
	interface BoxCharNode extends BoxNode {
		type: "char",
		char: string,
		unicode: number,
		style: Style,
		dimensions: Dimensions,
		bbox: BoundingBox
	}
`)}

${typeExampleTemplate}


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
	the tables below list some of the common characters by type, along with their aliases.  
	if you can't find a certain character, look at [fonts](#fonts) or in the [katex documentation](https://katex.org/docs/supported.html) since the fonts are from katex.
`)}

${operatorsTable}
${markdown(`
	functions like sin, ln, lim, etc. are of type "op".  
`)}

${binaryOperatorsTable}
${relationalTable}
${openCloseTable}

${miscTable}

`);
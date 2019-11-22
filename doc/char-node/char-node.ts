import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { typeView } from '../util/type-view';



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

interface CharAliasMap {
	char: string,
	aliases: string[]
}

const normalizeCharAliasEntry = (entry: { char: string, aliases?: string[] | string } | string) : CharAliasMap => {
	const isString = typeof(entry) === "string";
	return {
		char: isString ? entry : (entry as any).char,
		aliases: (isString ? [] : (entry as any).aliases)
	};
};
const aliasCharTemplate = (entry: CharAliasMap) => html`
	<div style="min-width: 42px; min-height: 42px; display: flex; flex-direction: column; border: 1.3px solid white;">
		<span style="display: flex; align-items: center; justify-content: center; flex: 1;">
			${entry.char}
		</span>
		
		<div style="display: flex; flex-direction: column;">
			${entry.aliases.slice(0, 1).map(alias => html`
				<span style="text-align: center; border-top: 1px solid white;">
					${alias}
				</span>
			`)}	
		</div>
	</div>
`;

const operatorsTable = html`
	<div style="display: flex;">
		${	
			[
				"+", "-", 
				{ char: "±", aliases: ["+-", "plusminus"] }, 
				{ char: "⋅", aliases: ["*", "muldot"] }, 
				"/", "÷", "×", "∘", 
				"&", "∧", "∨",
				"∖", "∪"
			]
			.map(normalizeCharAliasEntry)
			.map(aliasCharTemplate)
		}	
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
	the tables below list all the available characters by type, along with their aliases.
`)}


<h3>operators</h3>
${operatorsTable}

`);
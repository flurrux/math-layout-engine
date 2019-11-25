
import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { renderedFomula } from '../util/formula-render';

export default pageAnchor("example", html`

${markdown(`
	## quick example
	-----------------
`)}

${markdownCode(`
	import {
		layoutFormula,
		centerNodeOnCanvas, renderFormulaLayout, loadKatexFontFaces
	} from '@flurrux/math-layout-engine';

	//1 + 2 + 3 + ⋯ = -1/12
	const formula = {
		"type": "mathlist",
		"items": [
			{ "type": "ord", "value": "1" },
			{ "type": "bin", "value": "+" },
			{ "type": "ord", "value": "2" },
			{ "type": "bin", "value": "+" },
			{ "type": "ord", "value": "3" },
			{ "type": "bin", "value": "+" },
			{ "type": "ord", "value": "⋯" },
			{ "type": "rel", "value": "=" },
			{ "type": "ord", "value": "-" },
			{
				"type": "fraction",
				"numerator": { "type": "ord", "value": "1" },
				"denominator": { "type": "ord", "text": "12" }
			}
		]
	};
	const layoutedFormula = layoutFormula(formula);

	//render the formula
	document.body.insertAdjacentHTML("beforeend", \`
		<canvas id="math-canvas" width=800 height=400></canvas>
	\`);
	const canvas = document.querySelector("#math-canvas");
	const ctx = canvas.getContext("2d");
	//loading the fonts is asynchronous
	loadKatexFontFaces().then(
		() => renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutedFormula))
	);
`, "javascript")}

${markdown(`
	the render should look like
`)}

${renderedFomula({
	"type": "mathlist",
	"items": [
		{ "type": "ord", "value": "1" },
		{ "type": "bin", "value": "+" },
		{ "type": "ord", "value": "2" },
		{ "type": "bin", "value": "+" },
		{ "type": "ord", "value": "3" },
		{ "type": "bin", "value": "+" },
		{ "type": "ord", "value": "⋯" },
		{ "type": "rel", "value": "=" },
		{ "type": "ord", "value": "-" },
		{
			"type": "fraction",
			"numerator": { "type": "ord", "value": "1" },
			"denominator": { "type": "ord", "text": "12" }
		}
	]
})}
`);
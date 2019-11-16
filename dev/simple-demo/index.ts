
//type setting ###

/*
	sorted by personal rating of prioritiy of implementation:

	mathlist
	nucleus, subscript, superscript
	delimiter (( { [ )
	roots
	integrals, summation, limits	
	text
	operators (sin, cos, lim, ...)
	explicit node style
	punctuation
	cramped style
	matrix
	accents (dot, hat, ...)
	
	multiple prime accents
	accents that are not glyphs (overline, underline, arrows, ...)
	alignment in matrix	
	ellipsis inner type spacing problem
	binomials 
	manual spaces, maybe something like margin in style
	strike-through	

	todo:
	- error messages
	- understand tex-layout
	- make different-sized contours like delimiters and radicals have the same topology, 
	so they can be interpolated.
	- documentation for usage
	- thorough dev-documentation (tex-algorithm, own algorithm, ...)
	- parser

*/


import { loadKatexFontFaces, renderFormulaLayout, centerNodeOnCanvas } from '../../src/rendering/render';
import { layout } from '../../src/layout/layout';


async function main(){

	const formulaData = {
		"type": "mathlist",
		"style": { "type": "T" },
		"items": [
			{
				"type": "script",
				"nucleus": { "type": "op", "value": "sum" },
				"sub": {
					"type": "mathlist",
					"items": [
						{ "type": "ord", "value": "n" },
						{ "type": "rel", "value": "=" },
						{ "type": "ord", "value": "1" }
					]
				},
				"sup": {
					"type": "mathlist",
					"items": [
						{ "type": "ord", "value": "n" },
						{ "type": "rel", "value": "<" },
						{ "type": "ord", "text": "10" }
					]
				}
			},
			{
				"type": "fraction",
				"numerator": {
					"type": "script",
					"nucleus": { "type": "ord", "value": "2" },
					"sup": { "type": "ord", "value": "n" }
				},
				"denominator": { "type": "ord", "value": "pi" }
			}
		]
	};
	
	const layoutData = layout(formulaData);
	console.log(layoutData);

	document.body.insertAdjacentHTML("beforeend", `<canvas width=800 height=400></canvas>`);
	const canvas = document.querySelector("canvas");
	Object.assign(canvas, { 
		width: layoutData.dimensions.width + 40, 
		height: (layoutData.dimensions.yMax - layoutData.dimensions.yMin) + 40
	});
	const ctx = canvas.getContext("2d");
	await loadKatexFontFaces();
	renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutData));
}
main();
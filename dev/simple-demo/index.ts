
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
		"style": { "fontFamily": "Main", "emphasis": "Regular", "color": "cyan" },
		"items": [
			{
				"type": "accented",
				"nucleus": { "type": "ord", "value": "v" },
				"accent": { "type": "ord", "value": "dot-accent" }
			},
			{ "type": "rel", "value": "=", "style": { "color": "#7212d24a" } },
			{
				"type": "fraction",
				"numerator": {
					"type": "accented",
					"nucleus": { "type": "ord", "value": "f" },
					"accent": { "type": "ord", "value": "vector" }
				},
				"denominator": { "type": "ord", "value": "m" }
			}
		]
	};

	const layoutData = layout(formulaData);
	console.log(layoutData);

	document.body.insertAdjacentHTML("beforeend", `<canvas width=800 height=400></canvas>`);
	const canvas = document.querySelector("canvas");
	const padding = 32;
	Object.assign(canvas, { 
		width: layoutData.dimensions.width + padding, 
		height: (layoutData.dimensions.yMax - layoutData.dimensions.yMin) + padding
	});
	const ctx = canvas.getContext("2d");
	await loadKatexFontFaces();
	renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutData));
}
main();
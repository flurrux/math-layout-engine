
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
	- make different-sized contours like delimiters and radicals have the same topology, 
	so they can be interpolated.
	- thorough documentation (tex-algorithm, own algorithm, ...)
	- parser

*/


import { loadKatexFontFaces, renderFormulaLayout, centerNodeOnCanvas } from './rendering/render';
import { layoutNode } from './layout/layout';

async function main(){

	//continued fractions 

	
	const formulaData = {
		type: "mathlist",
		items: [
			{ 
				type: "script",
				nucleus: { type: "op", value: "sum" },
				sub: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "n" },
						{ type: "ord", value: "=" },
						{ type: "ord", value: "1" }
					]
				},
				sup: { type: "ord", value: "infinity" }
			},
			{
				type: "fraction",
				numerator: { type: "ord", value: "1" },
				denominator: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "n" },
						{ type: "ord", value: "!" },
					]
				}
			},
			{ type: "rel", value: "=" },
			{ type: "ord", value: "e" }
		]
	};
	
	const defaultStyle = {
		type: "D", 
		baseFontSize: 40,
		fontSize: 40,
	};
	
	const layoutData = layoutNode({ ...formulaData, style: defaultStyle });
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
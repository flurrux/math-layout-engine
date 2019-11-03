
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
	accents that are not glyphs (overline, underline)
	ellipsis inner type spacing problem
	binomials 
	manual spaces
*/


import { loadKatexFontFaces, renderFormulaLayout, centerNodeOnCanvas } from './rendering/render.js';
import { layoutNode } from './layout.js';


async function main(){

	const formulaData = {
		type: "mathlist",
		items: [
			{ type: "ord", value: "f" },
			{ type: "open", value: "(" },
			{ type: "ord", value: "x" },
			{ type: "close", value: ")" },
			{ type: "rel", value: "=" },
			{ type: "ord", value: "x" },
			{ type: "bin", value: "*" },
			{ type: "open", value: "(" },
			{ type: "ord", value: "x" },
			{ type: "ord", value: "+" },
			{ type: "ord", value: "1" },
			{ type: "close", value: ")" },
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
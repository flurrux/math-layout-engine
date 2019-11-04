
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

	//continued fractions 
	//matrix2d general inverse

	/*
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
	*/

	const formulaData = {
		type: "mathlist",
		items: [
			{
				type: "script",
				nucleus: {
					type: "delimited",
					leftDelim: { type: "open", value: "[" },
					rightDelim: { type: "close", value: "]" },
					delimited: {
						type: "matrix",
						rowCount: 2, 
						colCount: 2,
						rowSpacing: 0.5,
						colSpacing: 0.5,
						items: [
							{ type: "ord", value: "a" },
							{ type: "ord", value: "b" },
							{ type: "ord", value: "c" },
							{ type: "ord", value: "d" },
						]
					}
				},
				sup: { 
					type: "mathlist",
					items: [
						{ type: "ord", value: "-" },
						{ type: "ord", value: "1" }
					]
				}
			},
			{ type: "rel", value: "=" },
			{
				type: "delimited",
				leftDelim: { type: "open", value: "[" },
				rightDelim: { type: "close", value: "]" },
				delimited: {
					type: "matrix",
					rowCount: 2, 
					colCount: 2,
					rowSpacing: 0.5,
					colSpacing: 0.5,
					items: [
						{ 
							type: "mathlist", 
							items: [
								{ type: "ord", value: "+" },
								{ type: "ord", value: "d" },
							]
						},
						{ 
							type: "mathlist", 
							items: [
								{ type: "ord", value: "-" },
								{ type: "ord", value: "b" },
							]
						},
						{ 
							type: "mathlist", 
							items: [
								{ type: "ord", value: "-" },
								{ type: "ord", value: "c" },
							]
						},
						{ 
							type: "mathlist", 
							items: [
								{ type: "ord", value: "+" },
								{ type: "ord", value: "a" },
							]
						},
					]
				}
			},
			{ type: "bin", value: "*" },
			{
				type: "fraction",
				numerator: { type: "ord", value: "1" },
				style: { type: "T", fontSize: 20 },
				denominator: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "a" },
						{ type: "bin", value: "*" },
						{ type: "ord", value: "d" },
						{ type: "bin", value: "-" },
						{ type: "ord", value: "b" },
						{ type: "bin", value: "*" },
						{ type: "ord", value: "c" }
					]
				}
			}
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
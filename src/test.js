
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

	let formulaData = {
		type: "mathlist", 
		items: [
			{
				type: "root",
				radicand: {
					type: "fraction",
					numerator: { type: "ord", value: "1" },
					denominator: { type: "ord", value: "pi" }
				},
				index: { 
					type: "delimited", 
					leftDelim: { type: "open", value: "(" },
					rightDelim: { type: "open", value: ")" },
					delimited: {
						type: "fraction",
						numerator: { type: "ord", value: "7" },
						denominator: { type: "ord", value: "delta" }
					}
				}
			},
			{ type: "bin", value: "+" },
			{ type: "ord", value: "alpha" }
		]
	};
	formulaData = {
		type: "mathlist", 
		items: [
			{
				type: "script", 
				nucleus: {
					type: "op", value: "integral"
				},
				sup: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "+" },
						{ type: "ord", value: "8" }
					]
				},
				sub: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "-" },
						{ type: "ord", value: "4" }
					]
				}
			},
			{
				type: "root", 
				radicand: {
					type: "ord", value: "x"
				}
			},
			{ type: "ord", value: "a" }
		]
	};
	formulaData = {
		type: "mathlist", 
		items: [
			{
				type: "root",
				radicand: {
					//type: "ord", value: "alpha"
					type: "fraction", 
					numerator: { type: "ord", value: "1" },
					denominator: { type: "ord", value: "a" },
				}
			},
			{
				type: "ord", value: "x"
			},
			{
				type: "fraction", 
				numerator: { type: "ord", value: "2" },
				denominator: { type: "ord", value: "beta" }
			}
		]
	};
	formulaData = {
		type: "delimited",
		leftDelim: { type: "open", value: "(" },
		rightDelim: { type: "close", value: ")" },
		delimited: {
			type: "mathlist", 
			items: [
				{
					type: "delimited", 
					delimited: {
						type: "mathlist", 
						items: [
							{
								type: "fraction",
								numerator: { type: "ord", value: "a" },
								denominator: { type: "ord", value: "b" },
							},
							{ type: "bin", value: "+" },
							{
								type: "fraction",
								numerator: { type: "ord", value: "f" },
								denominator: { type: "ord", value: "M" },
							},
						]
					},
					leftDelim: { type: "open", value: "(" },
					rightDelim: { type: "close", value: ")" }
				},
				{ type: "bin", value: "muldot" },
				{
					type: "delimited",
					delimited: {
						type: "mathlist",
						items: [
							{ type: "ord", value: "c" },
							{ type: "bin", value: "-" },
							{ type: "ord", value: "d" },
						]
					},
					leftDelim: { type: "open", value: "(" },
					rightDelim: { type: "close", value: ")" }
				}
			]
		}
	};
	formulaData = {
		type: "mathlist", 
		items: [
			{
				type: "script", 
				nucleus: { type: "op", value: "sum" },
				sub: {
					type: "mathlist", 
					items: [
						{ type: "ord", value: "x" },
						{ type: "rel", value: "->" },
						{ type: "ord", value: "infinity" }
					]
				}
			},
			{ type: "ord", value: "a" },
			{ type: "bin", value: "*" },
			{ type: "ord", value: "x" }
		]
	};
	formulaData = {
		type: "delimited",
		leftDelim: { type: "open", value: "[" },
		rightDelim: { type: "close", value: "]" },
		delimited: {
			type: "matrix",
			rowCount: 2,
			colCount: 2,
			rowSpacing: 0.2, colSpacing: 0.6,
			items: [
				{ type: "ord", value: "a" },
				{ type: "ord", value: "b" },
				{ type: "ord", value: "c" },
				{ type: "ord", value: "d" }
			]
		}
	};
	formulaData = {
		type: "script",
		nucleus: { type: "ord", value: "f" },
		sup: { type: "ord", value: "'" }
	};
	formulaData = {
		type: "mathlist",
		items: [
			{
				type: "accented", 
				nucleus: { type: "ord", value: "i" },
				accent: { type: "ord", value: "^" }
			},
			{ type: "bin", value: "+" },
			{
				type: "accented", 
				nucleus: { type: "ord", value: "j" },
				accent: { type: "ord", value: "^" }
			},
			{ type: "bin", value: "+" },
			{
				type: "accented", 
				nucleus: { type: "ord", value: "k" },
				accent: { type: "ord", value: "^" }
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
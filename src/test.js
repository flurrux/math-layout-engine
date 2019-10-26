
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
	cramped style, tight style
	ellipsis
	matrix
	binomials 
	accents (dot, hat, ...)
	manual spaces
*/


import { loadKatexFontFaces, renderFormulaLayout, centerNodeOnCanvas } from './rendering/render.js';
import { layoutNode } from './layout.js';


async function main(){

	let formulaData = {
		root: {
			type: "mathlist", 
			items: [
				{
					type: "root",
					radicand: {
						type: "fraction",
						numerator: { type: "ord", value: "one" },
						denominator: { type: "ord", value: "pi" }
					},
					index: { 
						type: "delimited", 
						leftDelim: { type: "open", value: "parenleft" },
						rightDelim: { type: "open", value: "parenright" },
						delimited: {
							type: "fraction",
							numerator: { type: "ord", value: "seven" },
							denominator: { type: "ord", value: "delta" }
						}
					}
				},
				{ type: "bin", value: "plus" },
				{ type: "ord", value: "alpha" }
			]
		}
	};
	formulaData = {
		root: {
			type: "mathlist", 
			items: [
				{ type: "ord", value: "one" },
				{ 
					type: "delimited", 
					leftDelim: { type: "open", value: "parenleft" },
					rightDelim: { type: "close", value: "parenright" },
					delimited: { type: "ord", value: "omega" }
				},
				{ type: "ord", value: "two" },
			]
		}
	};
	formulaData = {
		root: {
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
							{ type: "ord", value: "plus" },
							{ type: "ord", value: "8" }
						]
					},
					sub: {
						type: "mathlist",
						items: [
							{ type: "ord", value: "minus" },
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
		}
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
		type: "script", 
		nucleus: { type: "ord", text: "lim" },
		sub: {
			type: "mathlist", 
			items: [
				{ type: "ord", value: "x" },
				{ type: "rel", value: "->" },
				{ type: "ord", value: "infinity" }
			]
		}
	};
	formulaData = {
		type: "mathlist",
		items: [
			{ type: "ord", value: "a" },
			{ type: "ord", value: "⋯" }
		]
	};

	
	const layoutData = layoutNode({
		type: "D", 
		baseFontSize: 40,
		fontSize: 40
	}, formulaData);

	document.body.insertAdjacentHTML("beforeend", `<canvas width=800 height=400></canvas>`);
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	await loadKatexFontFaces();
	renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutData));
}
main();
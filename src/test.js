
//type setting ###

/*
	sorted by personal rating of prioritiy of implementation:

	mathlist
	nucleus, subscript, superscript
	delimiter (( { [ )
	roots
	integrals, summation, limits	
	
	operators (sin, cos, lim, ...)
	binomials 
	matrix
	cramped style
	ellipsis
	accents (dot, hat, ...)
	manual spaces
	text
*/

import * as R from 'ramda';
import { pickList, accumSum, clamp, scaleMap, isDefined } from './util.js';

const emToPx = (style, em) => style.fontSize * em / 1000;

//formula description ###

const formulaNodeTypes = [
	"ord", "op", "bin", "rel", "open", "close",
	"punct", "inner", "spacing"
];
const innerTypes = ["mathlist", "fraction", "root", "script"];
const getIndexOfFormulaNodeType = (nodeType) => {
	if (innerTypes.includes(nodeType)) nodeType = "inner";
	return formulaNodeTypes.indexOf(nodeType);
};
const isFormulaNodeGlyph = node => [0, 1, 2, 3, 4, 5, 6].includes(getIndexOfFormulaNodeType(node.type));

//style ###
import { createDelimiter } from './delimiter-util.js';
import { createRadical } from './create-radical.js';
import { lookUpGlyphByCharOrAlias, objectifyMetrics, getMetrics, getDefaultEmphasis } from './font-data/katex-font-util.js';
import { getTargetYOfGlyphNucleus } from './script-layout.js';
import { loadKatexFontFaces, renderFormulaLayout } from './rendering/render.js';

const getGlyphMetrics = (node) => {
	const { fontFamily, unicode } = lookUpGlyphByCharOrAlias(node.value);
	return objectifyMetrics(getMetrics(fontFamily, getDefaultEmphasis(fontFamily), unicode));
};

const lookupFontName = (glyphName) => {
	const glyphData = lookUpGlyphByCharOrAlias(glyphName);
	const { fontFamily } = glyphData;
	const katexFontKey = `KaTeX_${fontFamily}`
	return katexFontKey;
};
const lookupFont = (glyphName) => opentypeFonts[lookupFontName(glyphName)];
const getGlyphByValue = (font, val) => {
	const { unicode } = lookUpGlyphByCharOrAlias(val);
	const char = String.fromCharCode(unicode);
	return font.charToGlyph(char);
};
const unicodeOfCharNode = node => lookUpGlyphByCharOrAlias(node.value).unicode;





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

	
	const layoutData = layoutNode({
		type: "D", 
		baseFontSize: 40,
		fontSize: 40
	}, formulaData);

	document.body.insertAdjacentHTML("beforeend", `<canvas width=800 height=400></canvas>`);
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
	await loadKatexFontFaces();
	renderFormulaLayout(canvas, ctx, layoutData);
}
main();
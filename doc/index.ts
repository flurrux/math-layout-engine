import * as marked from 'marked';

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/github.css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);


import { loadKatexFontFaces } from '../src/rendering/render';

import formulaToRendering from './formula-to-rendering.png';
import quickExampleRender from './quick-example-render.png';

const markdownStr = `



## installation  

todo



## description  

this engine turns an abstract formula-description into a layout-description, 
that can be rendered to canvas.  

![formula to rendering, example image](${formulaToRendering})  

you can play around in the live-editor here:  
<https://tender-brattain-a839fc.netlify.com/>




## quick example  


\`\`\`javascript
import {
	layoutFormula,
	centerNodeOnCanvas, renderFormulaLayout, loadKatexFontFaces
} from 'math-layout';

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

\`\`\`

the render should look like  

![render result](${quickExampleRender})




## FormulaNode  


\`\`\`typescript
interface FormulaNode {
	type: "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct" 
		| "mathlist" | "fraction" | "root" | "script" | "delimited" | "accented",  

    style?: Style
}
\`\`\`

the node-types fall into two categories:  
char/text: ord, op, bin, rel, open, close, punct  
composite: mathlist, fraction, root, script, delimited, accented  

they are detailed further below.  

nodes may or may not have an explicit style.  
styles can be used to control font-family, font-size and emphasis (italic, bold).  
usually at least the root node has a style that is passed down to every subnode recursively.  
if no style is given at all, a default style is used.  





## Style  

\`\`\`typescript
interface Style {
	type?: "D" | "T" | "S" | "SS",
	fontSize?: number,
	emphasis?: "Regular" | "Bold" | "Italic" | "BoldItalic",
	fontFamily?: "Math"| "Main" |
		"Size1" | "Size2" | "Size3" | "Size4" |
		"SansSerif" | "Caligraphic" | "AMS" | "Fraktur" | "Typewriter" | "Script"
	cramped?: boolean
};
\`\`\`

D -> display  
T -> text  
S -> script  
SS -> script of script  

emphasis describes one of 4 possible combinations of regular/bold and italic/normal.  
some fonts don't support every combination.  

the cramped boolean means that a node should take up less vertical space,  
so superscripts are raised less (and that's it?).  
if not set explicitly, denominator nodes in fractions will be passed a style with the  
cramped property set to true.  





### fonts  

## BoxNode  


## CharNode

types: ord, bin, rel, open, close, ...  
these types are basically only used for horizontal spacing.  
todo: available symbols
todo: aliases

## TextNode

## MathList  

## Fraction  

## Script  

## Root  

## Delimiter  

## Accent  

## Matrix  



`;

(async () => {
	await loadKatexFontFaces();
	const html = marked.parse(markdownStr, {
		highlight: (code: string, lang: string, callback) => {
			return hljs.highlight(lang, code, true).value;
		}
	});
    document.body.querySelector("#page").innerHTML = html;
})();
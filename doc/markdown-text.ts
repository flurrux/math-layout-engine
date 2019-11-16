import formulaToRendering from './formula-to-rendering.png';
import quickExampleRender from './quick-example-render.png';

import displayDemoImg from './style-type-demo/display.png';
import inlineDemoImg from './style-type-demo/text.png';
import scriptDemoImg from './style-type-demo/script.png';
import scriptOfScriptDemo from './style-type-demo/script-of-script.png';

export const markdownStr = `



## installation  

todo



## description  

this engine turns an abstract formula-description into a layout-description, 
that can be rendered to canvas.  

![formula to rendering, example image](${formulaToRendering})  

you can play around in the live-editor here:  
<https://tender-brattain-a839fc.netlify.com/>

this documentation uses [typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html) to describe the structure of data.  

## disclaimer & credits  

some layout-algorithms and principles were taken from 
[the texbook](http://www.ctex.org/documents/shredder/src/texbook.pdf) (mainly [pages 440 to 447](https://github.com/flurrux/math-layout-engine/blob/master/dev/tex/texbook-generating-boxes.pdf)),  
other parts i have simply guessed and gone with my gut-feeling.  
i have marked the sections in this documentation where the code  
is close to tex and other parts that i made up myself.  

the part that i have neglected the most is probably (horizontal) kerning,  
because i don't understand it very well.  

for fonts and references i have used katex.  
their [live editor](https://katex.org/#demo) is really good to see what things should look like.  
links to [fonts](https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/) and [metrics](https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js).  

other font-data like bounding-boxes and glyph-contours are accessed with [opentype.js](https://opentype.js.org/).  









## quick example  
-----------------

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
---------------

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
usually you supply the topmost node with a style and the algorithms passes that style  
down to child-nodes and adjusts it appropriately (e.g a superscript node gets a style with type "S" or "SS").  
if you don't specify a style for the topmost node, a default style is used:  

\`\`\`typescript
const defaultStyle : Style = {
	type: "D", 
	fontSize: 40
}
\`\`\`

see @Style for more information.  


## Style  
---------


\`\`\`typescript
interface Style {
	type?: "D" | "T" | "S" | "SS",
	fontSize?: number,
	emphasis?: "Regular" | "Bold" | "Italic" | "BoldItalic",

	fontFamily?: "Math"| "Main" |
		"Size1" | "Size2" | "Size3" | "Size4" |
		"SansSerif" | "Caligraphic" | "AMS" | "Fraktur" | "Typewriter" | "Script",

	cramped?: boolean
};
\`\`\`

### type
(as in tex)

#### D (display)  
![demo img](${displayDemoImg})  
- numerators and denominators are further apart (than in text-style)  
- superscripts are raised higher  
- big operators are bigger and sub- and superscripts are placed below and above  

#### T (text or inline)  
![demo img](${inlineDemoImg})  
this style takes up less vertical space than display-style.  

S (script)  
![demo img](${scriptDemoImg})  
- fontSize is reduced to 0.7 multiplied by the "base"-fontSize
- no spacing between items in mathlist

SS (script of script)  
![demo img](${scriptOfScriptDemo})  
- fontSize is reduced to 0.5 multiplied by the "base"-fontSize  

the "base"-fontSize depends on the type and fontSize of a node.  
if there are two nested script-nodes like x^(2^2), then the superscript at the end  
is scaled by 0.5 relative to the x-node, **not** by 0.7 × 0.5!  


todo: examples of each style-type

### emphasis  
emphasis describes one of 4 possible combinations of regular/bold and italic/normal.  
some fonts don't support every combination.  

### cramped  
the cramped boolean means that a node should take up less vertical space,  
so superscripts are raised less (and that's it?).  
nodes that are placed under lines like denominators have a cramped-style.  





## Fonts  
---------

## BoxNode  
-----------

## CharNode
------------

types: ord, bin, rel, open, close, ...  
these types are basically only used for horizontal spacing.  
todo: available symbols
todo: aliases

## TextNode
------------


## MathList  
------------

## Fraction  
------------

## Script  
----------

## Root  
--------

## Delimiter  
-------------

## Accent  
----------

## Matrix  
----------



`;
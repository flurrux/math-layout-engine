import { Converter } from 'showdown';
const converter = new Converter();
import './fonts-overview.js';
import './glyph-metrics-inspector.js';
import { loadKatexFontFaces } from './load-katex-font-faces.js';

import parsingToRenderingImg from './parsing-to-rendering.png';



const markdownStr = `

## intro

First of all, why am i making this library? 
There already is [katex, "the fastest math typesetting library for the web"](https://katex.org/),  

Katex is great, hands down, but it has a downside, namely it only produces html.  
If i want to know exactly what position a certain symbol has,  
i would need to render the katex-string and then lookup the element 
in the dom, which is not straightforward.  
As nice as declarative rendering of math-formulae with katex is, it is not suited for 
this use-case of animation that i had in mind.  

this is my attempt at making a mathematical layout system.  
it is specifically intended for the use-case where a math-formula is layouted  
and then drawn onto the canvas.  

i'm heavily using the katex library as a reference but this is still more  
like a half-assed project. i don't want to spend too much time making everything  
perfect, just good enough.  

in the future, if this library turns out to be very valuable, i probably will  
fully read the [tex-book](http://www.ctex.org/documents/shredder/src/texbook.pdf) and overhaul this thing.  


## fonts  

the most important assets here are the fonts.  
this engine would be nothing without them.  

i'm using the fonts from katex which are hosted [here](https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/).  
it's crucial to understand them first.  

every font is hosted in 3 formats: TTF, WOFF, WOFF2.  
at the time of this writing, WOFF seems to be more widely supported than the other two formats.  
but i'm more used to TTF as it is more prominent in [opentypejs](https://opentype.js.org/),  
or atleast that's what i'm thinking. probably need to use WOFF more.  

quick overview of the fonts

<font-overview-table></font-overview-table>


## glyph-metrics


<glyph-metrics-inspector></glyph-metrics-inspector>

there is also the bounding-box (bbox) of a glyph.  
as far as i know it is not used in tex or katex,  
but i'm using it in several places.  


the complete metrics-data is located at "src/font-data/font-metrics-data.js".  
it's taken directly from [katex](https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js).  
i have modified it file at two places so far. i've adjusted the skew-parameter for the characters  
'i' (code: 105) and 'j' (code 106) in the font "Math-Italic".  

As for the bounding boxes, i generated them myself with the help of [opentypejs](https://opentype.js.org).  
they are located at "src/font-data/font-bbox-data.js".  



## glyph-lookup

a char-node in the abstract-formula-description may not have a font-family,  
so in that case we have to lookup the most appropriate font-family and emphasis (italic/bold/...).  

there is an "alias-map" in src/font-data/katex-font-util.js that maps characters or aliases to a font-family.  

example:    
\`\`\` { alias: ["plusminus", "+-"], fontFamily: "Main", unicode: 177 } \`\`\`  

aliases are useful because we don't need to find and copy-paste the character.  

if there is no entry, there is a fixed order of font-families to search through until the character is found.  


## style

after the layout-algorithm is done, every node has a style-property.  
a style object has a 
- type  
- baseFontSize  
- fontSize  
- fontFamily (optional)  
- emphasis (options)  
- cramped-flag  







## layout

the main functionality is to turn an abstract formula-description into a layout-description, 
which can then be rendered.  

![parsing to rendering](${parsingToRenderingImg})

parsing is not implemented yet. the functionality of highest priority is layout.

todo: principles (axis, alignment, boxes)
todo: types of layout (char, text, mathlist, delimiter, fraction, script, root, accent, matrix)







`;

(async () => {
    await loadKatexFontFaces();
    document.body.querySelector("#page").innerHTML = converter.makeHtml(markdownStr);
})();
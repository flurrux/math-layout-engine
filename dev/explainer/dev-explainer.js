import { Converter } from 'showdown';
const converter = new Converter();
import './fonts-overview.js';
import './glyph-metrics-inspector.js';
import { loadKatexFontFaces } from './load-katex-font-faces.js';

import parsingToRenderingImg from './parsing-to-rendering.png';



const markdownStr = `
# dev-explainer

this is a kinda in-depth explainer.  

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


## glyphs 

the glyphs in the fonts above are all described by a series of quadratic bezier curves and straight lines, 
but that's not that important. more important are the metrics of a glyph.  

<glyph-metrics-inspector></glyph-metrics-inspector>

the metrics of a glyph are relative to the baseline. that's the axis where the glyphs are aligned.  
short glyphs like a or x sit directly on the baseline, while f intersects the baseline.  

todo: width, height and depth can be shown graphically.  
todo: italic correction.  

the bounding-box (short bbox) is the smallest box that conains the glyph.  

the complete metrics-data is located at "src/font-data/font-metrics-data.js".  
it's taken directly from [katex](https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js).  
i have modified it file at two places so far. i've adjusted the skew-parameter for the characters  
'i' (code: 105) and 'j' (code 106) in the font "Math-Italic".  

As for the bounding boxes, i generated them myself with the help of [opentypejs](https://opentype.js.org).  
they are located at "src/font-data/font-bbox-data.js".  



todo: glyph lookup



## layout

the main functionality is to turn an abstract formula-description into a layout-description, 
which can then be rendered.  

![parsing to rendering](${parsingToRenderingImg})

parsing is not implemented yet. the functionality of highest priority is layout.

todo: types of layout
todo: math-axis



## style





`;

(async () => {
    await loadKatexFontFaces();
    document.body.insertAdjacentHTML("beforeend", "<glyph-metrics-inspector></glyph-metrics-inspector>");
    // const container = document.createElement("div");
    // container.style.padding = "20px";
    // container.innerHTML = converter.makeHtml(markdownStr);
    // document.body.appendChild(container);
})();
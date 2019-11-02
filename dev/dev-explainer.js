import { Converter } from 'showdown';
const converter = new Converter();
import './fonts-overview.js';
import { loadKatexFontFaces } from './load-katex-font-faces.js';

const result = converter.makeHtml(`
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





`);
loadKatexFontFaces();
const container = document.createElement("div");
container.style.padding = "20px";
container.innerHTML = result;
document.body.appendChild(container);
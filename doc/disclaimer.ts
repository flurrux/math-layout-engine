
import { html } from 'lit-html';
import { markdown } from './util/lit-marked';
import { pageAnchor } from './util/page-anchor';

export default pageAnchor("disclaimer--credits", html`
${markdown(`
    ## disclaimer & credits  

    some layout-algorithms and principles were taken from 
    [the texbook](http://www.ctex.org/documents/shredder/src/texbook.pdf) 
    (mainly [pages 440 to 447](https://github.com/flurrux/math-layout-engine/blob/master/dev/tex/texbook-generating-boxes.pdf)),  
    
    other parts i have simply guessed and gone with my gut-feeling.  
    
    i have marked the sections in this documentation where the code  
    is close to tex and other parts that i made up myself.  
    
    the part that i have neglected the most is probably (horizontal) kerning,  
    because i don't understand it very well.  
    
    for fonts and references i have used katex.  
    their [live editor](https://katex.org/#demo) is really good to see what things should look like.  
    links to [fonts](https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/) and [metrics](https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js).  

    other font-data like bounding-boxes and glyph-contours are accessed with [opentype.js](https://opentype.js.org/).  
`)}
`);
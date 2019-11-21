import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

import displayDemoImg from './style-type-demo/display.png';
import inlineDemoImg from './style-type-demo/inline.png';
import scriptDemoImg from './style-type-demo/script.png';
import scriptOfScriptDemo from './style-type-demo/script-of-script.png';
import crampedDemo from './style-type-demo/cramped.png';
import uncrampedDemo from './style-type-demo/uncramped.png';

export default pageAnchor("style", html`


${markdown(`
	## Style
	---------
`)}

${markdownCode(`
	interface Style {
		type?: "D" | "T" | "S" | "SS",
		fontSize?: number,
		emphasis?: "Regular" | "Bold" | "Italic" | "BoldItalic",

		fontFamily?: "Math"| "Main" |
			"Size1" | "Size2" | "Size3" | "Size4" |
			"SansSerif" | "Caligraphic" | "AMS" | "Fraktur" | "Typewriter" | "Script",

		cramped?: boolean
	}
`, "typescript")}

${markdown(`
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

	#### S (script)  
	![demo img](${scriptDemoImg})  
	- fontSize is reduced to 0.7 multiplied by the "base"-fontSize
	- no spacing between items in mathlist
	
	#### SS (script of script)  
	![demo img](${scriptOfScriptDemo})  
	- fontSize is reduced to 0.5 multiplied by the "base"-fontSize  

	the "base"-fontSize depends on the type and fontSize of a node.  
	if there are two nested script-nodes like x^(2^2), then the superscript at the end  
	is scaled by 0.5 relative to the x-node, **not** by 0.7 × 0.5!  


	### emphasis  
	emphasis describes one of 4 possible combinations of regular/bold and italic/normal.  
	some fonts don't support every combination.  

	### cramped  
	the cramped boolean means that a node should take up less vertical space,  
	so superscripts are raised less (and that's it?).  
	nodes that are placed under lines like denominators have a cramped-style.  
`)}

<div style="
		display: grid; grid-template-columns: min-content min-content; 
		grid-column-gap: 14px; justify-items: center; align-items: end;
	"
>
	<div>cramped</div>
	<div>uncramped</div>
	<img src="${crampedDemo}" />
	<img src="${uncrampedDemo}" />
</div>

`);
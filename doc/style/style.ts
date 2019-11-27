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

		cramped?: boolean,
		color?: string
	}
`, "typescript")}

<h3>type</h3>
<div>
	<style>
		.style-type-table {
			align-items: center;
			grid-template-columns: 1fr;
			display: grid; 
			column-gap: 10px;
			justify-items: center;
		}
		@media only screen and (min-width: 740px) {
			.style-type-table { 
				grid-template-columns: max-content min-content 1fr;
				row-gap: 10px; 
				justify-items: flex-start;
			}
		}
	</style>
	<div class="style-type-table">
		<h4>D (display)</h4>
		<img src="${displayDemoImg}" />
		${markdown(`
			- numerators and denominators are further apart (than in text-style)  
			- superscripts are raised higher  
			- big operators are bigger and sub- and superscripts are placed below and above  
		`)}
	
		<h4>T (text/inline)</h4>
		<img src="${inlineDemoImg}" />
		${markdown(`
			- takes up less vertical space than display-style
		`)}
	
		<h4>S (script)</h4>
		<img src="${scriptDemoImg}" />
		${markdown(`
			- fontSize is reduced to 0.7 multiplied by the "base-fontSize"
			- no spacing between horizontal items
		`)}
	
		<h4>SS (script of script)</h4>
		<img src="${scriptOfScriptDemo}" />
		${markdown(`
			- same as script-style except: 
			- fontSize is reduced to 0.5 multiplied by the "base-fontSize"
		`)}
	</div>
</div>

${markdown(`
	the "base-fontSize" depends on the type and fontSize of a node.  
	if there are two nested script-nodes like x^(2^2), then the superscript at the end  
	is scaled by 0.5 relative to the x-node, **not** by 0.7 × 0.5!  


	### emphasis  
	emphasis describes one of 4 possible combinations of regular/bold and italic/normal.  
	some fonts don't support every combination.  

	### cramped  
	the cramped boolean means that a node should take up less vertical space,  
	so superscripts are raised less (and that's it?).  
	nodes that are placed under lines like denominators have a cramped-style.  

	### color
	examples: "black", "lightgray ", "#ffa500", "rgb(20, 70, 22)"  
	see [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) for more details.  
`)}

<style>
	.cramped-uncramped-container {
		display: flex; 
		justify-content: center;
	}
	@media only screen and (min-width: 600px) {
		.cramped-uncramped-container { 
			justify-content: flex-start;
		}
	}

	.cramped-uncramped-table {
		display: grid; 
		grid-template-columns: min-content min-content; 
		grid-column-gap: 14px; 
		justify-items: center; 
		align-items: end;
	}
	.cramped-uncramped-table div {
		font-weight: bold;
	}
</style>
<div class="cramped-uncramped-container">
	<div class="cramped-uncramped-table">
		<div>cramped</div>
		<div>uncramped</div>
		<img src="${crampedDemo}" />
		<img src="${uncrampedDemo}" />
	</div>
</div>

`);
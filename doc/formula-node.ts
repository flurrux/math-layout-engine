


import { html } from 'lit-html';
import { markdown, markdownCode } from './util/lit-marked';
import { pageAnchor } from './util/page-anchor';


export default pageAnchor("formulanode", html`

${markdown(`
	## FormulaNode  
	---------------
`)}

${markdownCode(`
	interface FormulaNode {
		type: "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct" 
			| "mathlist" | "fraction" | "root" | "script" | "delimited" | "accented" | "matrix",  

		style?: Style
	}
`, "typescript")}

${markdown(`
	### type 

	the node-types fall into two categories:  
	<div style="display: grid; grid-template-columns: max-content 1fr; grid-column-gap: 10px;">
		<span style="font-weight: bold;">char/text:</span>
		<span>ord, op, bin, rel, open, close, punct</span>
		<span style="font-weight: bold;">composite:</span>
		<span>mathlist, fraction, root, script, delimited, accented</span>
	</div>

	they are detailed further below.  

	### style

	nodes may or may not have an explicit style.  
	styles can be used to control font-family, font-size and emphasis (italic, bold).  
	usually you supply the topmost node with a style and the algorithms passes that style  
	down to child-nodes and adjusts it appropriately (e.g a superscript node gets a style with type "S" or "SS").  
`)}
	
${markdown(`
	if you don't specify a style for the topmost node, a default style is used:  
`)}
${markdownCode(`
	const defaultStyle : Style = {
		type: "D", 
		fontSize: 40
	}
`, "typescript")}

`);
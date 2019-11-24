import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';

export default pageAnchor("contoursnode", html`

${markdown(`
	## ContoursNode
	----------------
`)}

${markdownCode(`
	interface GlyphPoint {
		x: number, 
		y: number, 
		onCurve: boolean
		[propName: string]: any;
	}
	interface ContoursNode extends BoxNode {
		type: "contours",
		contours: GlyphPoint[][]
	}
`, "typescript")}

${markdown(`
	in opentype, glyphs are represented by contours which are essentially 
	closed loops made out of straight lines and/or quadratic bezier curves.  
	
	some of the glyphs in this engine are dynamically created like [radicals](#root) and [dynamic delimiters](#delimiter).
	
	glyph-points can either be on the curve or not.  
	there is an implicit point halfway between two consecutive off-curve points,  
	maybe a pre-processing step can take care of this.   
	a sequence of: *on curve → off curve → on curve* is a quadratic bezier curve.  
	a squence of: *on curve → on curve* is a straight line.  
`)}



`);
export default `
## ContoursNode
----------------

\`\`\`typescript
interface GlyphPoint {
	x: number, 
	y: number, 
	onCurve: boolean
	lastPointOfContour?: boolean
}
interface ContoursNode extends BoxNode {
	type: "contours",
	contours: GlyphPoint[][]
}
\`\`\`



[radicals](#root) and [dynamic delimiters](#delimiter) are ContoursNodes.  
`;
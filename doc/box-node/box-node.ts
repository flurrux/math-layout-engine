
export default `

## BoxNode
-----------

\`\`\`typescript
interface BoxNode {
	type: "char" | "text" | 
		"mathlist" | "fraction" | "root" | "script" | "delimited" | "accented" | "matrix" | 
		"contours" | "rule",

	position?: [number, number],
	dimensions: {
		width: number, 
		yMin: number,
		yMax: number
	},
	style?: Style
};
\`\`\`

all the nodes after layout extend from BoxNode.  

`;

export default `

## FormulaNode  
---------------

\`\`\`typescript
interface FormulaNode {
	type: "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct" 
		| "mathlist" | "fraction" | "root" | "script" | "delimited" | "accented",  

    style?: Style
}
\`\`\`

the node-types fall into two categories:  
char/text: ord, op, bin, rel, open, close, punct  
composite: mathlist, fraction, root, script, delimited, accented  

they are detailed further below.  

nodes may or may not have an explicit style.  
styles can be used to control font-family, font-size and emphasis (italic, bold).  
usually you supply the topmost node with a style and the algorithms passes that style  
down to child-nodes and adjusts it appropriately (e.g a superscript node gets a style with type "S" or "SS").  
if you don't specify a style for the topmost node, a default style is used:  

\`\`\`typescript
const defaultStyle : Style = {
	type: "D", 
	fontSize: 40
}
\`\`\`

see [Style](#style) for more information.  
`;
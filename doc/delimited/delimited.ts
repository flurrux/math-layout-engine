export default `
## delimiter

\`\`\`typescript
interface DelimitedNode extends FormulaNode {
	type: "delimited",
	leftDelim: FormulaNode,
	rightDelim: FormulaNode,
	delimited: FormulaNode
}
\`\`\`

delimiters can be placed by using 
\`\`\`typescript
{ "type": "open", "value": "(" }
\`\`\`
but they do not change their size dynamically to accomodate to their enclosed nodes.  
to do that, use DelimitedNode.  

these are all the possible delimiter-characters that can be used:  

"(", ")", "[", "]", "{", "}", "⟨", "⟩", "|", "⌈", "⌉", "⌊", "⌋"



`;
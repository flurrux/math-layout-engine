export default `
## character
------------

\`\`\`typescript
interface CharNode extends FormulaNode {
	type: "ord" | "op" | "bin" | "rel" | "open" | "close" | "punct",
	value: string
}

interface BoxCharNode extends BoxNode {
	type: "char",
	char: string,
	unicode: number,
	style: Style,
	dimensions: Dimensions,
	bbox: BoundingBox
}
\`\`\`

### types
ord (ordinary): use this when none of the types below match your type  
op (operator): ∑ ∏ sin exp ln  
bin (binary): binary operators, + - * /  
rel (relational): relational operators, = < > ∈ ⊆  
open: opening delimiter, ( [ ⟨  
close: closing delimiter, ) ] ⟩  
punct (punctution): , ;  

todo: available symbols  
todo: aliases
`;
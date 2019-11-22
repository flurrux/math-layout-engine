
import fractionDemo from './fraction-demo.png';
import labeledParts from './fraction-labeled.png';

export default `
## fraction
------------

this algorithm was implemented as described in the texbook (page 445, number 15)

\`\`\`typescript
interface FractionNode extends FormulaNode {
	type: "fraction",
	numerator: FormulaNode,
	denominator: FormulaNode
}
\`\`\`

\`\`\`typescript
interface BoxFractionNode extends BoxNode {
	type: "fraction",
	numerator: BoxNode,
	denominator: BoxNode,
	rule: RuleNode
}
interface RuleNode extends BoxNode { 
	type: "rule" 
}
\`\`\`

![labeled parts](${labeledParts})

the horizontal division-line in a fraction is called a rule and its width spans the entire BoxFractionNode.  
the line itself is centered vertically.  


### example
\`\`\`javascript
{
  "type": "fraction",
  "numerator": {
    "type": "ord", "value": "μ"
  },
  "denominator": {
    "type": "mathlist",
    "items": [
      { "type": "ord", "value": "1" },
      { "type": "bin", "value": "+" },
      {
        "type": "fraction",
        "numerator": { "type": "ord", "value": "μ" },
        "denominator": { "type": "ord", "value": "beta" }
      }
    ]
  }
}
\`\`\`

![fraction demo](${fractionDemo})
`;
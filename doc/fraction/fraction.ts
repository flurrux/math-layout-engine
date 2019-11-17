
import fractionDemo from './fraction-demo.png';

export default `
## Fraction
------------

\`\`\`typescript
interface FractionNode extends FormulaNode {
	type: "fraction",
	numerator: FormulaNode,
	denominator: FormulaNode
}
\`\`\`

after layout:
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

the horizontal division-line in a fraction is called a rule and  
its width spans the entire BoxFractionNode.  
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
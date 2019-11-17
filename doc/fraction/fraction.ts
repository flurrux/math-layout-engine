
import fractionDemo from './fraction-demo.png';

export default `
## Fraction
------------

\`\`\`typescript
interface FractionNode extends FormulaNode {
	numerator: FormulaNode,
	denominator: FormulaNode
}
\`\`\`

after layout:
\`\`\`typescript
interface BoxFractionNode extends BoxNode {
	numerator: BoxNode,
	denominator: BoxNode,

	ruleThickness: number,
	ruleY: number
}
\`\`\`

the horizontal division-line in a fraction is called a rule and  
its width spans the entire BoxFractionNode.  
it's thickness and y-coordinate relative to the BoxFractionNode  
are given by "ruleThickness" and "ruleY".  
it's is drawn in such a way that half of its height is above the y-coordinate  
and the other half below.

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
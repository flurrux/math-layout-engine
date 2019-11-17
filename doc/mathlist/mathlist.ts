
import mathListDemo from './mathlist-demo.png';


export default `

## MathList
------------

\`\`\`typescript
interface MathListNode extends FormulaNode {
	items: FormulaNode[]
}
\`\`\`

after layout:
\`\`\`typescript
interface BoxMathListNode extends BoxNode {
	items: BoxNode[]
}
\`\`\`


### example
\`\`\`javascript
{
  "type": "mathlist",
  "items": [
    { "type": "ord", "value": "-" },
    { "type": "ord", "value": "x" },
    { "type": "bin", "value": "*" },
    { "type": "open", "value": "(" },
    { "type": "ord", "value": "1" },
    { "type": "bin", "value": "+" },
    { "type": "ord", "value": "x" },
    { "type": "ord", "value": ")" }
  ]
}
\`\`\`

![mathlist rendered](${mathListDemo})
`;

import textNodeDemoImg from './textnode-demo.png';

export default `
## text
------------

\`\`\`typescript
export interface TextNode extends FormulaNode {
	type: "ord" | "op",
	text: string
}
\`\`\`

\`\`\`typescript
export interface BoxTextNode extends BoxNode {
	type: "text",
	text: string,
	style: Style
}
\`\`\`

### example
\`\`\`javascript
{
    "type": "mathlist",
    "items": [
        { "type": "ord", "value": "pi" },
        { "type": "rel", "value": "=" },
        { "type": "op", "text": "asin" },
        { "type": "open", "value": "(" },
        { "type": "ord", "value": "1" },
        { "type": "close", "value": ")" },
        { "type": "rel", "value": "=" },
        { "type": "ord", "text": "3.14159..." }
    ]
}
\`\`\`
![demo](${textNodeDemoImg})

`;
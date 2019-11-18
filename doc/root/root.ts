
import demoImg from './demo.png';
import labeledPartsImg from './root-labeled.png';

export default `
## root  
--------
\`\`\`typescript
interface RootNode extends FormulaNode {
	type: "root",
	radicand: FormulaNode,
	index?: FormulaNode
}

interface BoxRootNode extends BoxNode {
	type: "root",
	radical: ContoursNode,
	radicand: BoxNode,
	index?: BoxNode
}
\`\`\`

![labeled parts](${labeledPartsImg})

### example

\`\`\`javascript
{
	"type": "root",
	"radicand": {
		"type": "fraction",
		"numerator": { "type": "ord", "value": "1" },
		"denominator": { "type": "ord", "value": "e" }
	},
	"index": { "type": "ord", "text": "999" }
}
\`\`\`
![demo](${demoImg})

`;
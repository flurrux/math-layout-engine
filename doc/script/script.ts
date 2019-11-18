
import labeledPartsImg from './script-labeled.png';
import limExampleImg from './lim-example.png';
import integralExampleImg from './integral-example.png';

export default `
## script  
----------

\`\`\`typescript
interface ScriptNode extends FormulaNode {
	type: "script",
	nucleus: FormulaNode,
	sup?: FormulaNode,
	sub?: FormulaNode
}

interface BoxScriptNode extends BoxNode {
	nucleus: BoxNode,
	sup?: BoxNode,
	sub?: BoxNode
}
\`\`\`

![labeled parts](${labeledPartsImg})

**sup** is short for superscript
**sub** is short for subscript

sometimes, sub- and superscript appear above/below the nucleus,  
typically when the nucleus is a big operator like a sum or product, or with limits.  

### examples

\`\`\`javascript
{
	"type": "script",
	"nucleus": { "type": "op", "text": "lim" },
	"sub": {
		"type": "mathlist",
		"items": [
			{ "type": "ord", "value": "x" },
			{ "type": "ord", "value": "->" },
			{ "type": "ord", "value": "infinity" }
		]
	}
}
\`\`\`
![rendering](${limExampleImg})


\`\`\`javascript
{
	"type": "mathlist",
	"items": [
		{
			"type": "script",
			"nucleus": { "type": "op", "value": "integral" },
			"sup": { "type": "ord", "value": "1" },
			"sub": { "type": "ord", "value": "0" }
		},
		{
			"type": "script",
			"nucleus": { "type": "ord", "value": "i" },
			"sup": { "type": "ord", "value": "x" },
		},
		{ "type": "bin", "value": "*" },
		{ "type": "ord", "value": "d" },
		{ "type": "ord", "value": "x" },
	]
}
\`\`\`
![rendering](${integralExampleImg})

`;
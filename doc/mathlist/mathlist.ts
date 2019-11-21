


import { html } from 'lit-html';
import { markdown, markdownCode } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import { codeAndRender } from '../util/formula-and-render';
import { typeView } from '../util/type-view';


export default pageAnchor("mathlist", html`

${markdown(`
    ## mathlist
    ------------
`)}

${typeView(`
    interface MathListNode extends FormulaNode {
        items: FormulaNode[]
    }
`, `
    interface BoxMathListNode extends BoxNode {
    items: BoxNode[]
    }
`)}

${markdown(`
  ### example
`)}
${codeAndRender(`
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
`)}
`);
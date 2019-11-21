
import primeAccentImg from './prime-accents.png';
import exampleImg from './example.png';

// import '../formula-and-render';
// const formulaAndRender = (formula: object) : string => {
//     const formulaStr = JSON.stringify(formula);
//     const str = `<formula-and-render formula="${formulaStr}"></formula-and-render>`;
//     console.log(str);
//     return str;
// };


export default `
## accent
----------

\`\`\`typescript
interface AccentNode extends FormulaNode {
    type: "accented",
    nucleus: FormulaNode,
    accent: CharNode
}

interface BoxAccentNode extends BoxNode {
    type: "accented"
    nucleus: BoxNode,
    accent: BoxCharNode
}
\`\`\`

for prime-accents, use superscript:
\`\`\`javascript
{
    "type": "script",
    "nucleus": { "type": "ord", "value": "f" },
    "sup": { "type": "ord", "text": "′′" }
}
\`\`\`
![render](${primeAccentImg})

### example
\`\`\`formularender
{ 
    "type": "mathlist",
    "style": { "fontFamily": "Main", "emphasis": "Regular" },
    "items": [
        {
            "type": "accented",
            "nucleus": { "type": "ord", "value": "v" },
            "accent": { "type": "ord", "value": "dotaccent" }
        },
        { "type": "rel", "value": "=" },
        {
            "type": "fraction",
            "numerator": {
                "type": "accented",
                "nucleus": { "type": "ord", "value": "f" },
                "accent": { "type": "ord", "value": "vector" }
            },
            "denominator": { "type": "ord", "value": "m" }
        }
    ]
}
\`\`\`
![render](${exampleImg})

`;
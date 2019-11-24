## description

this is a small engine for calculating the layout of math-formulae.  
unlike [katex](https://katex.org/) it produces a fixed layout in pojo format which can then be rendered to canvas.  

[try it live!](https://tender-brattain-a839fc.netlify.com/)


## installation  

for now this library can only be included in a node-project  

```json
// package.json
...
"dependencies": {
    "math-layout": "flurrux/math-layout-engine#master",
}
...
```


## usage  

layout a formula and render it

```javascript
import { 
    layoutFormula, 
    centerNodeOnCanvas, renderFormulaLayout, loadKatexFontFaces
} from 'math-layout';

const formula = {
    "type": "mathlist",
    "items": [
        { "type": "ord", "value": "1" },
        { "type": "bin", "value": "+" },
        { "type": "ord", "value": "2" },
        { "type": "bin", "value": "+" },
        { "type": "ord", "value": "3" },
        { "type": "bin", "value": "+" },
        { "type": "ord", "value": "⋯" },
        { "type": "rel", "value": "=" },
        { "type": "ord", "value": "-" },
        {
            "type": "fraction",
            "numerator": { "type": "ord", "value": "1" },
            "denominator": { "type": "ord", "text": "12" }
        }
    ]
};
const layoutedFormula = layoutFormula(formula);

//render the formula
document.body.insertAdjacentHTML("beforeend", `
    <canvas id="math-canvas" width=800 height=400></canvas>
`);
const canvas = document.querySelector("#math-canvas");
const ctx = canvas.getContext("2d");
//loading the fonts is asynchronous
loadKatexFontFaces().then(
    () => renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutedFormula))
);

```

### documentation 

<https://lucid-panini-eb3886.netlify.com/>


## examples  

```javascript
{
    type: "mathlist",
    items: [
        { type: "ord", value: "f" },
        { type: "open", value: "(" },
        { type: "ord", value: "x" },
        { type: "close", value: ")" },
        { type: "rel", value: "=" },
        { type: "ord", value: "x" },
        { type: "bin", value: "*" },
        { type: "open", value: "(" },
        { type: "ord", value: "x" },
        { type: "ord", value: "+" },
        { type: "ord", value: "1" },
        { type: "close", value: ")" },
    ]
}
```
![rendered formula](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-11.png)


## credits  

i used [katex](https://katex.org/#demo) as a reference for my renderings.  
also the [font-data](https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js) and [fonts](https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/) are directly taken from katex.  

furthermore i tried to implement the algorithms as described in the texbook (starting at page 440) where it was possible. it still differs at some places though and i'm not sure if i understand them correctly.  
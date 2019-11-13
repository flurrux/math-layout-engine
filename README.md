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

---

```javascript
{
    type: "mathlist",
    items: [
        { 
            type: "script",
            nucleus: { type: "op", text: "lim" },
            sub: {
                type: "mathlist",
                items: [
                    { type: "ord", value: "x" },
                    { type: "ord", value: "->" },
                    { type: "ord", value: "infinity" }
                ]
            }
        },
        { type: "op", text: "ln" },
        { type: "open", value: "(" },
        { type: "ord", value: "x" },
        { type: "close", value: ")" },
        { type: "rel", value: "=" },
        { type: "ord", value: "infinity" }
    ]
}
```
![rendered formula](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-12.png) 

---


```javascript
{
    type: "root",
    index: { type: "ord", value: "4" },
    radicand: {
        type: "mathlist",
        items: [
            { type: "ord", value: "1" },
            { type: "bin", value: "+"},
            {
                type: "root",
                radicand: {
                    type: "mathlist",
                    items: [
                        { type: "ord", value: "2" },
                        { type: "bin", value: "+"},
                        {
                            type: "root",
                            radicand: {
                                type: "mathlist",
                                items: [
                                    { type: "ord", value: "3" },
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```
![rendered formula](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-13.png) 

---

```javascript
{
    type: "mathlist",
    items: [
        {
            type: "script",
            nucleus: {
                type: "delimited",
                leftDelim: { type: "open", value: "[" },
                rightDelim: { type: "close", value: "]" },
                delimited: {
                    type: "matrix",
                    rowCount: 2, 
                    colCount: 2,
                    rowSpacing: 0.5,
                    colSpacing: 0.5,
                    items: [
                        { type: "ord", value: "a" },
                        { type: "ord", value: "b" },
                        { type: "ord", value: "c" },
                        { type: "ord", value: "d" },
                    ]
                }
            },
            sup: { 
                type: "mathlist",
                items: [
                    { type: "ord", value: "-" },
                    { type: "ord", value: "1" }
                ]
            }
        },
        { type: "rel", value: "=" },
        {
            type: "delimited",
            leftDelim: { type: "open", value: "[" },
            rightDelim: { type: "close", value: "]" },
            delimited: {
                type: "matrix",
                rowCount: 2, 
                colCount: 2,
                rowSpacing: 0.5,
                colSpacing: 0.5,
                items: [
                    { 
                        type: "mathlist", 
                        items: [
                            { type: "ord", value: "+" },
                            { type: "ord", value: "d" },
                        ]
                    },
                    { 
                        type: "mathlist", 
                        items: [
                            { type: "ord", value: "-" },
                            { type: "ord", value: "b" },
                        ]
                    },
                    { 
                        type: "mathlist", 
                        items: [
                            { type: "ord", value: "-" },
                            { type: "ord", value: "c" },
                        ]
                    },
                    { 
                        type: "mathlist", 
                        items: [
                            { type: "ord", value: "+" },
                            { type: "ord", value: "a" },
                        ]
                    },
                ]
            }
        },
        { type: "bin", value: "*" },
        {
            type: "fraction",
            numerator: { type: "ord", value: "1" },
            style: { type: "T", fontSize: 20 },
            denominator: {
                type: "mathlist",
                items: [
                    { type: "ord", value: "a" },
                    { type: "bin", value: "*" },
                    { type: "ord", value: "d" },
                    { type: "bin", value: "-" },
                    { type: "ord", value: "b" },
                    { type: "bin", value: "*" },
                    { type: "ord", value: "c" }
                ]
            }
        }
    ]
}
```
![rendered formula](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-14.png) 


---

```javascript
{
    type: "mathlist",
    items: [
        { 
            type: "script",
            nucleus: { type: "op", value: "sum" },
            sub: {
                type: "mathlist",
                items: [
                    { type: "ord", value: "n" },
                    { type: "ord", value: "=" },
                    { type: "ord", value: "1" }
                ]
            },
            sup: { type: "ord", value: "infinity" }
        },
        {
            type: "fraction",
            numerator: { type: "ord", value: "1" },
            denominator: {
                type: "mathlist",
                items: [
                    { type: "ord", value: "n" },
                    { type: "ord", value: "!" },
                ]
            }
        },
        { type: "rel", value: "=" },
        { type: "ord", value: "e" }
    ]
}
```
![rendered formula](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-15.png) 
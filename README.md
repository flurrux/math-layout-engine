

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
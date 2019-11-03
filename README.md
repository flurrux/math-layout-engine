

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
![rendered formula 1](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-11.png)

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
![rendered formula 1](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-12.png) 

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
![rendered formula 1](https://github.com/flurrux/math-layout-engine/blob/master/dev/sample-renders/sample-render-13.png) 

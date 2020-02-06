import { parse } from "../../src/parsing/parser";
import { loadKatexFontFaces, renderFormulaLayout, centerNodeOnCanvas } from '../../src/rendering/render';
import { layout } from '../../src/layout/layout';
import { assocPath } from "ramda";

// const expression = "\\alpha + \\frac({\\pi}{2}) \\<= ({5} * 3)";
// const expression = "a / b";


async function main(){
	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");
    await loadKatexFontFaces();
    const inputEl = document.querySelector("input");
    const onInput = (text: string) => {
        try {
            let formula = parse(text);
            console.log(formula);
            formula = assocPath(["style", "color"], "white", formula);
            const layoutData = layout(formula)

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutData));
        }
        catch(e){
            console.error(e);
        }
    };
    inputEl.addEventListener("input", e => onInput((e as any).srcElement.value));
}
main();
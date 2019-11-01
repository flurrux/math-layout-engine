import { getMetricsObject, lookUpBoundingBox } from "../src/font-data/katex-font-util";
import { fromPairs } from 'ramda';
import { addFontFaces } from "../src/util";
import { loadOpentypeAsync } from "../src/opentype-util";

const loadFonts = async () => {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const fontEntries = [
        ["KaTeX_Main-Regular", "KaTeX_Main-Regular.ttf"],
        ["KaTeX_Math-Italic", "KaTeX_Math-Italic.ttf"],
		["KaTeX_Size1", "KaTeX_Size1-Regular.ttf"],
		["KaTeX_Size2", "KaTeX_Size2-Regular.ttf"],
		["KaTeX_Size3", "KaTeX_Size3-Regular.ttf"],
		["KaTeX_Size4", "KaTeX_Size4-Regular.ttf"]
	];
    const fontUrlMap = fromPairs(fontEntries.map(entry => [entry[0], baseUrl + entry[1]]));
	await addFontFaces(fontUrlMap);
};


document.body.insertAdjacentHTML("beforeend", `
    <canvas width="1000" height="500"></canvas>
`);
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const fontSize = 50;

const glyphData = (char, fontFamily, emphasis) => {
    const unicode = char.charCodeAt(0);
    return {
        fontName: `${fontFamily}-${emphasis}`,
        value: char,
        unicode,
        metrics: getMetricsObject(fontFamily, emphasis, unicode),
        bbox: lookUpBoundingBox(fontFamily, unicode, emphasis)
    }
};

const charData = glyphData("d", "Math", "Italic");
const accentData = glyphData(String.fromCharCode(8407), "Main", "Regular");

const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.setTransform(fontSize, 0, 0, -fontSize, canvas.width / 2, canvas.height / 2);
    
    //axes
    {
        ctx.beginPath();
        ctx.moveTo(-1000, 0);
        ctx.lineTo(1000, 0);
        ctx.moveTo(0, -1000);
        ctx.lineTo(0, 1000);
        ctx.lineWidth = 0.04;
        ctx.stroke();
    }

    ctx.fillStyle = "white";

    ctx.save();
    ctx.scale(1, -1);
    ctx.font = `1px KaTeX_${charData.fontName}`;
    ctx.fillText(charData.value, 0, 0);
    ctx.restore();

    ctx.save();

    const accentWidth = 0.471;
    const accentX = (charData.metrics.width + charData.metrics.italicCorrection - accentWidth) / 2 + charData.metrics.skew;
    const accentY = charData.metrics.height - accentData.bbox[1] + 0.08;
    ctx.translate(accentX + accentWidth, accentY);
    ctx.scale(1, -1);
    ctx.font = `1px KaTeX_${accentData.fontName}`;
    ctx.fillText(accentData.value, 0, 0);
    ctx.restore();

    // ctx.lineWidth = 0.03;
    // ctx.strokeStyle = "cyan";
    // drawLine(ctx, metrics.width + metrics.italicCorrection, -5, metrics.width + metrics.italicCorrection, 5);
    // ctx.strokeStyle = "red";
    // drawLine(ctx, charData.metrics.width, -5, charData.metrics.width, 5);

    ctx.restore();
};

const main = async () => {
    await loadFonts();
    render();
};
main();
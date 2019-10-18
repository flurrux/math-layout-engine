import { loadFontsAsync } from './opentype-util.js';

const main = async () => {
    const keys = [
        "Size1-Regular", "Size2-Regular", "Size3-Regular", "Size4-Regular"
    ];
    const urlMap = keys.reduce((map, key) => Object.assign(map, { [key]: `https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${key}.ttf` }), {});
    const fontMap = await loadFontsAsync(urlMap);
    
    const rootIndex = 41;
    const glyph = fontMap["Size4-Regular"].glyphs.glyphs[rootIndex];
    glyph.getPath();
    const rootData = {
        fontFamily: "Size4",
        bbox: ["xMin", "yMin", "xMax", "yMax"].reduce((obj, key) => Object.assign(obj, { [key]: glyph[key] / 1000 }), {}),
        contours: glyph.getContours().map(contour => contour.map(point => {
            return {
                ...point, 
                x: point.x / 1000,
                y: point.y / 1000
            }
        }))
    };
    console.log(JSON.stringify(rootData, null, 4));
};
main();
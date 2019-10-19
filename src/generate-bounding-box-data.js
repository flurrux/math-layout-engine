import { fontData } from './katex-font-util.js';
import { loadFontsAsync } from './opentype-util.js';

const getBboxesOfFont = font => {
    const glyphs = font.glyphs.glyphs;
    const glyphKeys = Reflect.ownKeys(glyphs);
    return glyphKeys.reduce((bboxes, glyphKey) => {
        const glyph = glyphs[glyphKey];
        if (glyph.unicode === undefined || glyph.xMin === undefined) return bboxes;
        return Object.assign(bboxes, {
            [glyph.unicode]: `[${[glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax].map(val => val / 1000).join(", ")}]`
        });
    }, {});
};

const main = async () => {
    const keys = fontData.reduce((list, entry) => [...list, ...entry.emphasis.map(emph => `${entry.name}-${emph}`)], []);
    const urlMap = keys.reduce((map, key) => Object.assign(map, { [key]: `https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${key}.ttf` }), {});
    const fontMap = await loadFontsAsync(urlMap);
    const bboxMap = Reflect.ownKeys(fontMap).reduce((bboxes, fontKey) => Object.assign(bboxes, { [fontKey]: getBboxesOfFont(fontMap[fontKey]) }), {});
    const stringifiedBboxMap = JSON.stringify(bboxMap, null, 4);
    console.log(stringifiedBboxMap);
};
main();
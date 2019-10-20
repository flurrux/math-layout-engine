import { loadFontsAsync } from '../src/opentype-util.js';
import { getUrlByFontName } from '../src/font-data/katex-font-util.js';
import { map, pick, pipe } from 'ramda';

const toPxSpace = val => val / 1000;
const normalizeBbox = glyph => pipe(pick(["xMin", "yMin", "xMax", "yMax"]), map(toPxSpace))(glyph);
const normalizeContours = glyph => glyph.getContours().map(contour => contour.map(glyphPoint => {
	return {
		onCurve: glyphPoint.onCurve,
		x: toPxSpace(glyphPoint.x),
		y: toPxSpace(glyphPoint.y)
	}
}));
const normalizeBboxAndContours = glyph => {
	glyph.getPath();
	return {
		bbox: normalizeBbox(glyph),
		contours: normalizeContours(glyph)
	};
};

const main = async () => {
    const keys = [
		"Size1-Regular", "Size2-Regular", "Size3-Regular", "Size4-Regular"
    ];
	const urlMap = keys.reduce((map, key) => Object.assign(map, { [key]: `https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${key}.ttf` }), {});
    const fontMap = await loadFontsAsync(urlMap);
	
	const getGlyphByUnicode = (font, unicode) => font.charToGlyph(String.fromCharCode(unicode));
	const getGlyphsByUnicode = unicode => keys.reduce((glyphs, key) => {
		const font = fontMap[key];
		const glyph = getGlyphByUnicode(font, unicode);
		if (glyph){
			glyphs.push({ fontId: key, unicode, glyph });
		}
		return glyphs;
	}, []);

	const unicodes = [
		40, 41, 123, 125, 
		91, 93, 10216, 10217, 
		8739, 8968, 8969,
		8970, 8971
	];
	const glyphsByUnicodes = unicodes.map(unicode => getGlyphsByUnicode(unicode)).flat()
		.map(entry => {
			const { glyph } = entry;
			return {
				...pick(["fontId", "unicode"], entry),
				...normalizeBboxAndContours(glyph)
			}
		})
		.reduce((mapByUnicode, entry) => Object.assign(mapByUnicode, {
			[entry.unicode]: [
				...(mapByUnicode[entry.unicode] || []),
				pick(["fontId", "bbox", "contours"], entry)
			]
		}), {});

	console.log(JSON.stringify(glyphsByUnicodes, null, 4));
};
main();
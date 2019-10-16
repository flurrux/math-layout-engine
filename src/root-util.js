import { getGlyphContours, scaleContours } from "./opentype-util";
import * as R from 'ramda';

const rootFontKeys = [
	"KaTeX_Size1",
	"KaTeX_Size2",
	"KaTeX_Size3",
	"KaTeX_Size4",
];
const rootGlyphIndices = [
    25, 20, 17, 17, 41
];
const roofAttachements = [
    [8, 10], [0, 2], [20, 23], [4, 7], [22, 26]
];
const verticalRootHeight = 1807;
const indexPositions = [
    [520, 290], [520, 290], [520, 290], [520, 290], [540, 800]
];

const getGlyphByIndex = (font, index) => font.glyphs.glyphs[index];

const getFontKeyForRootHeight = (fontMap, height) => {
    for (let i = 0; i < rootFontKeys.length - 1; i++){
        const fontKey = rootFontKeys[i];
        const font = fontMap[fontKey];
        const glyph = getGlyphByIndex(font, rootGlyphIndices[i]);
        const glyphHeight = glyph.yMax - glyph.yMin;
        if (glyphHeight > height){
            return {
                fontKey, fontIndex: i,
                sizeRatio: height / glyphHeight,
                remainingHeight: glyphHeight - height
            };
        }
    }

    return null;
};

//{ contours, innerStartX, metrics }
export const createRoot = (fontMap, width, height, margin=0) => {
    const keyData = getFontKeyForRootHeight(fontMap, height + margin);
    if (keyData){
        const { fontIndex } = keyData;
        const glyph = getGlyphByIndex(fontMap[keyData.fontKey], rootGlyphIndices[fontIndex]);
        const glyphScale = Math.min(0.7, keyData.sizeRatio) / 0.7;
        const contour = scaleContours(glyphScale, getGlyphContours(glyph))[0];
        const glyphMetrics = R.map(val => val * glyphScale, R.pick(["xMax", "yMin", "yMax"], glyph));


        const attachementInds = roofAttachements[fontIndex];
        const endX = glyphMetrics.xMax + width;

        const extendedContour = [
            ...contour.slice(0, attachementInds[0] + 1),
            { ...contour[attachementInds[0]], x: endX },
            { ...contour[attachementInds[1]], x: endX },
            ...contour.slice(attachementInds[1])
        ];
        const extendedContours = [extendedContour];

        return {
            contours: extendedContours,
            innerStartX: glyphMetrics.xMax, 
            indexCorner: indexPositions[fontIndex],
            metrics: {
                width: endX,
                yMin: glyphMetrics.yMin,
                yMax: glyphMetrics.yMax
            }
        };
    }
    else {
        const fontIndex = rootFontKeys.length;
        const glyph = getGlyphByIndex(fontMap["KaTeX_Size4"], rootGlyphIndices[fontIndex]);
        const contour = getGlyphContours(glyph)[0];
        const endX = glyph.advanceWidth + width;
        const roofStartY = -885 + height + margin;
        const roofThickness = 17;
        const roofEndY = roofStartY + roofThickness;

        const extendedContours = [[
            ...contour.slice(0, 22),
            { ...contour[22], y: roofEndY },
            { ...contour[22], y: roofEndY, x: endX },
            { ...contour[26], y: roofStartY, x: endX },
            { ...contour[26], y: roofStartY },
            ...contour.slice(27)
        ]];

        return {
            contours: extendedContours,
            innerStartX: 1056,
            indexCorner: indexPositions[fontIndex],
            metrics: {
                width: endX,
                yMin: glyph.yMin,
                yMax: roofEndY
            }
        };
    }
};

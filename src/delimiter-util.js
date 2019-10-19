//delimiters:
//parenthesis ()
//braces {}
//brackets []
//vertical lines: ||
//ceil, floor





import {
    getGlyphByName, getGlyphMetrics, getCharByName, getGlyphContours
} from './opentype-util.js';

const axisHeight = 250;
const getHeightAndDepthByGlyphName = (font, name) => getHeightAndDepthOfGlyph(getGlyphByName(font, name));
const getHeightOfGlyph = (glyph) => glyph.yMax - glyph.yMin;
const getHeightAndDepthOfGlyph = (glyph) => [glyph.yMax, glyph.yMin];




const maxFontKey = "KaTeX_Size4";
const getMaxSizeFont = (fontMap) => fontMap[maxFontKey];

//the height and depth should be the same for all delimiters, 
//here only height is returned, so half of the vertical size
const getHeightOfDelimiter = (font, delimName) => getGlyphMetrics(font, delimName).yMax - axisHeight;

const delimiterFontKeys = [
    "KaTeX_Main",
	"KaTeX_Size1",
	"KaTeX_Size2",
	"KaTeX_Size3",
	"KaTeX_Size4",
];
const getFontFittingHeight = (fontMap, glyphName, height, depth) => {
    const heights = delimiterFontKeys.map(key => getHeightOfDelimiter(fontMap[key], glyphName));
    const heightToFit = Math.max(...[height, depth].map(Math.abs));

    let matchIndex = -1;
    let curRemaining = 0;
    let matchDelimHeight = 0;
	for (let i = 0; i < heights.length; i++){
        const delimHeight = heights[i];
        if (heightToFit > delimHeight){
			continue;
		}
		const remaining = delimHeight - heightToFit;
		if (matchIndex < 0 || remaining < curRemaining){
            matchIndex = i;
            curRemaining = remaining;
            matchDelimHeight = delimHeight;
        }
    }

	return matchIndex < 0 ? null : { 
        fontKey: delimiterFontKeys[matchIndex], 
        remainingSize: curRemaining, 
        sizeRatio: heightToFit / matchDelimHeight
    };
};

export const getDelimiterForHeightAndDepth = (fontMap, delimName, height, depth, extendFunc, margin=0) => {
    const fittingData = getFontFittingHeight(fontMap, delimName, height + margin, depth - margin);
    if (fittingData){
        const { fontKey, sizeRatio } = fittingData;
        return {
            type: "char",
            char: getCharByName(fontMap[fontKey], delimName),
            fontName: fontKey, sizeRatio,
            metrics: getGlyphMetrics(fontMap[fontKey], delimName)
        };
    }
    else {
        const maxFont = getMaxSizeFont(fontMap);
        const glyph = getGlyphByName(maxFont, delimName);
        const heightToFit = Math.max(...[height, depth].map(Math.abs));
        const defaultHeight = getHeightOfDelimiter(maxFont, delimName);
        const extension = heightToFit - defaultHeight + margin;
        const origContour = getGlyphContours(glyph)[0];
        const extendedContour = extendFunc(origContour, extension);
        const metrics = getGlyphMetrics(maxFont, delimName);
        return {
            type: "contours",
            contours: [extendedContour],
            metrics: {
                ...metrics, 
                yMax: metrics.yMax + extension,
                yMin: metrics.yMin - extension
            }
        };
    }
};

//the methods here work with em-units.

//brace
export const createExtendedLeftBrace = (origContour, extension) => [
    ...origContour.slice(0, 10),
    { ...origContour[9] },
    
    ...origContour.slice(10, 40),
    { ...origContour[39] },
    
    ...origContour.slice(40, 62),
    { ...origContour[61] },

    ...origContour.slice(62, 76),
    { ...origContour[75] },

    ...origContour.slice(76)
].map((pointData, index) => {
    let yOffset = 0;
    if (index < 10 || index > 78) yOffset = -extension
    else if (index > 40 && index < 64) yOffset = extension;

	return {
		...pointData,
		y: pointData.y + yOffset
	};
});

//14, 37, 59, 75
export const createExtendedRightBrace = (origContour, extension) => [
    ...origContour.slice(0, 15),
    { ...origContour[14] },
    
    ...origContour.slice(15, 38),
    { ...origContour[37] },
    
    ...origContour.slice(38, 60),
    { ...origContour[59] },

    ...origContour.slice(60, 76),
    { ...origContour[75] },

    ...origContour.slice(76)
].map((pointData, index) => {
    let yOffset = 0;
    if (index < 15 || index > 78) yOffset = extension
    else if (index > 38 && index < 62) yOffset = -extension;

	return {
		...pointData,
		y: pointData.y + yOffset
	};
});

//parenthesis
export const createExtendedLeftParenthesis = (origContour, extension) => [
	...origContour.slice(0, 10),
	{ ...origContour[9] },
	...origContour.slice(10, 24),
	{ ...origContour[23] },
	...origContour.slice(24)
].map((pointData, index) => {
	const yOffset = (index < 10 || index > 24) ? -extension : extension;
	return {
		...pointData,
		y: pointData.y + yOffset
	};
});
export const createExtendedRightParenthesis = (origContour, extension) => [
    ...origContour.slice(0, 9),

    { ...origContour[8], y: 251, onCurve: true },
    { ...origContour[8], y: 251, onCurve: true },

	...origContour.slice(9, 25),
    { ...origContour[24] },
    
	...origContour.slice(25)
].map((pointData, index) => {
	const yOffset = (index < 10 || index > 26) ? extension : -extension;
	return {
		...pointData,
		y: pointData.y + yOffset
	};
});

//bracket
const createExtendedLeftBracket = (origContour, extension) => origContour.map((pointData, index) => {
    const yOffset = (index < 1 || index > 4) ? -extension : extension;
    return { ...pointData, y: pointData.y + yOffset };
});
const createExtendedRightBracket = (origContour, extension) => origContour.map((pointData, index) => {
    const yOffset = (index > 2 && index < 7) ? -extension : extension;
    return { ...pointData, y: pointData.y + yOffset };
});


const extendFuncMap = {
    "parenleft": createExtendedLeftParenthesis, "parenright": createExtendedRightParenthesis,
    "braceleft": createExtendedLeftBrace, "braceright": createExtendedRightBrace,
    "bracketleft": createExtendedLeftBracket, "bracketright": createExtendedRightBracket
};
export const createDelimiter = (fontMap, delimName, height, depth, margin=0) => {
    if (extendFuncMap[delimName] === undefined){
        return null;
    }
    return getDelimiterForHeightAndDepth(fontMap, delimName, height, depth, extendFuncMap[delimName], margin);
};
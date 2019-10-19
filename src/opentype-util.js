import { load as loadOpentype } from 'opentype.js';
import * as R from 'ramda';

export const loadOpentypeAsync = url => new Promise((resolve, reject) => {
	loadOpentype(url, (err, result) => {
		if (err) {
			reject(err);
		}
		resolve(result);
	});
});

export const loadFontsAsync = async (fontUrlMap) => {
	const fontMap = {};
	const keys = Reflect.ownKeys(fontUrlMap);
	for (const key of keys){
		fontMap[key] = await loadOpentypeAsync(fontUrlMap[key]);
	}
	return fontMap;
};

export const getGlyphByName = (font, name) => {
	const glyphs = font.glyphs.glyphs;
	const glyphKey = Reflect.ownKeys(glyphs).find(key => glyphs[key].name === name);
	return glyphs[glyphKey];
};
export const getCharByName = (font, name) => {
	const glyph = getGlyphByName(font, name);
	return String.fromCharCode(glyph.unicode);
};
export const getGlyphIndexByName = (font, name) => getGlyphByName(font, name).index;
export const getGlyphByIndex = (font, index) => font.nameToGlyph(font.glyphIndexToName(index));

export const getInterspersedContour = (contour) => {
	let allPoints = [];
	for (let i = 0; i < contour.length; i++) {
		const pointData = contour[i];
		if (i > 0 && !pointData.onCurve && !contour[i - 1].onCurve){
			allPoints.push(getMiddleContourPoint(contour[i - 1], contour[i]));
		}
		allPoints.push({
			onCurve: pointData.onCurve,
			point: [pointData.x, pointData.y]
		});
	};

	//last and first point cases:
	//onCurve, onCurve: nothing
	//offCurve, onCurve: nothing
	//onCurve, offCurve: shift array
	//offCurve, offCurve: insert middle point at 0

	const firstPointData = allPoints[0];
	if (!firstPointData.onCurve){
		const lastPointData = allPoints[allPoints.length - 1];
		if (lastPointData.onCurve){
			allPoints = [ lastPointData, ...allPoints.slice(0, allPoints.length - 1) ];
		}
		else {
			allPoints = [ getMiddleContourPoint(lastPointData, firstPointData), ...allPoints ];
		}
	}

	return allPoints;
};

export const pathInterspersedContours = (ctx, contours) => {
	ctx.beginPath();
	for (const contour of contours){
		ctx.moveTo(...contour[0].point);
		for (let i = 1; i <= contour.length; i++){
			const pointData = contour[i % contour.length];
			if (pointData.onCurve){
				ctx.lineTo(...pointData.point);
			}
			else {
				const quadraticEndPoint = contour[(i + 1) % contour.length];
				ctx.quadraticCurveTo(...pointData.point, ...quadraticEndPoint.point);
				i++;
			}
		}
	}
};

export const pathContours = (ctx, contours) => pathInterspersedContours(ctx, contours.map(getInterspersedContour));

const getMiddleContourPoint = (a, b) => {
	return {
		point: [
			(a.x + b.x) / 2,
			(a.y + b.y) / 2
		],
		onCurve: true
	};
};

const transformPoint = (matrix, point) => [
	matrix[4] + matrix[0] * point[0] + matrix[2] * point[1],
	matrix[5] + matrix[1] * point[0] + matrix[3] * point[1]
];
export const transformContour = (matrix, contour) => contour.map(pointData => {
	const transformedPoint = transformPoint(matrix, [pointData.x, pointData.y]);
	return {
		...pointData,
		x: transformedPoint[0],
		y: transformedPoint[1]
	};
});
export const translateContours = (translation, contours) => contours.map(contour => contour.map(pointData => {
	return {
		...pointData,
		x: pointData.x + translation[0],
		y: pointData.y + translation[1]
	}
}));
export const scaleContours = (scale, contours) => contours.map(contour => contour.map(pointData => {
	return {
		...pointData,
		x: pointData.x * scale,
		y: pointData.y * scale
	}
}));

export const getGlyphMetrics = (font, glyphName) => {
    const glyph = getGlyphByName(font, glyphName);
    return {
        width: glyph.advanceWidth,
        yMin: glyph.yMin, yMax: glyph.yMax
    };
};

export const getGlyphContours = (glyph) => {
    //this has to be called to make contours available strangely
    glyph.getPath();
    return glyph.getContours();
};
import { identity, map } from 'ramda';
import { Vector2 } from './types';

export interface GlyphPoint {
	x: number, 
	y: number, 
	onCurve: boolean
	lastPointOfContour?: boolean
};
export type Contour = GlyphPoint[];
export type Contours = Contour[];
export interface Glyph {
	name: string,
	unicode: number,
	index: number,
	getContours: (() => Contour[]),
	getPath: Function,
	advanceWidth: number,
	yMin: number, 
	yMax: number,
	xMin: number,
	xMax: number
};
export interface OpentypeFont {
	nameToGlyph: ((name: string) => Glyph),
	glyphIndexToName: ((index: number) => string),
	glyphs: {
		glyphs: { [key: string] : Glyph }
	}
};
export interface BoundingBox {
	xMin: number, 
	yMin: number, 
	xMax: number, 
	yMax: number
};

/*
import { load as loadOpentype } from 'opentype.js';

export const loadOpentypeAsync = (url: string): Promise<OpentypeFont> => new Promise((resolve, reject) => {
	loadOpentype(url, (err, result) => {
		if (err) {
			reject(err);
		}
		resolve((result as unknown) as OpentypeFont);
	});
});

export const loadFontsAsync = async (fontUrlMap: {[key: string]: string}): Promise<{ [key: string]: OpentypeFont }> => {
	const fontMap = {};
	const keys = Reflect.ownKeys(fontUrlMap) as string[];
	for (const key of keys){
		fontMap[key] = await loadOpentypeAsync(fontUrlMap[key]);
	}
	return fontMap;
};

export const getGlyphByName = (font: OpentypeFont, name: string) : Glyph => {
	const glyphs = font.glyphs.glyphs;
	const glyphKey = (Reflect.ownKeys(glyphs) as string[]).find(key => glyphs[key].name === name);
	return glyphs[glyphKey];
};
export const getCharByName = (font: OpentypeFont, name: string) : string => {
	const glyph = getGlyphByName(font, name);
	return String.fromCharCode(glyph.unicode);
};
export const getGlyphIndexByName = (font: OpentypeFont, name: string) : number => getGlyphByName(font, name).index;
export const getGlyphByIndex = (font: OpentypeFont, index: number) : Glyph => font.nameToGlyph(font.glyphIndexToName(index));
export const getGlyphMetrics = (font: OpentypeFont, glyphName: string) : { width: number, yMin: number, yMax: number } => {
    const glyph = getGlyphByName(font, glyphName);
    return {
        width: glyph.advanceWidth,
        yMin: glyph.yMin, yMax: glyph.yMax
    };
};
*/

interface ExplicitGlyphPoint {
	point: Vector2,
	onCurve: boolean
};

export const getInterspersedContour = (contour: Contour) : ExplicitGlyphPoint[] => {
	let allPoints : { point: Vector2, onCurve: boolean }[] = [];
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
			allPoints = [ 
				{
					point: getMiddlePoint(lastPointData.point, firstPointData.point),
					onCurve: true
				},
				...allPoints 
			];
		}
	}

	return allPoints;
};

export const pathInterspersedContours = (ctx: CanvasRenderingContext2D, contours: ExplicitGlyphPoint[][]) => {
	ctx.beginPath();
	for (const contour of contours){
		const firstPoint = contour[0].point;
		ctx.moveTo(firstPoint[0], firstPoint[1]);
		for (let i = 1; i <= contour.length; i++){
			const pointData = contour[i % contour.length];
			if (pointData.onCurve){
				ctx.lineTo(pointData.point[0], pointData.point[1]);
			}
			else {
				const quadraticEndPoint = contour[(i + 1) % contour.length];
				ctx.quadraticCurveTo(pointData.point[0], pointData.point[1], quadraticEndPoint.point[0], quadraticEndPoint.point[1]);
				i++;
			}
		}
	}
};

export const pathContours = (ctx: CanvasRenderingContext2D, contours: Contour[]) => pathInterspersedContours(ctx, contours.map(getInterspersedContour));

const getMiddlePoint = (point1: Vector2, point2: Vector2) : Vector2 => [
	(point1[0] + point2[0]) / 2,
	(point1[1] + point2[1]) / 2
];
const getMiddleContourPoint = (a: GlyphPoint, b: GlyphPoint) : { point: Vector2, onCurve: boolean } => {
	return {
		point: [
			(a.x + b.x) / 2,
			(a.y + b.y) / 2
		],
		onCurve: true
	};
};

type Matrix = [number, number, number, number, number, number];
const transformPoint = (matrix: Matrix, point: Vector2) : Vector2 => [
	matrix[4] + matrix[0] * point[0] + matrix[2] * point[1],
	matrix[5] + matrix[1] * point[0] + matrix[3] * point[1]
];
export const transformContour = (matrix: Matrix, contour: Contour) : Contour => contour.map(pointData => {
	const transformedPoint = transformPoint(matrix, [pointData.x, pointData.y]);
	return {
		...pointData,
		x: transformedPoint[0],
		y: transformedPoint[1]
	};
});
export const transformBbox = (matrix: Matrix, bbox: BoundingBox) : BoundingBox => identity({
	xMin: bbox.xMin * matrix[0] + matrix[4],
	xMax: bbox.xMax * matrix[0] + matrix[4],
	yMin: bbox.yMin * matrix[3] + matrix[5],
	yMax: bbox.yMax * matrix[3] + matrix[5],
});
export const translateContours = (translation: Vector2, contours: Contour[]) : Contour[] => contours.map(contour => contour.map(pointData => {
	return {
		...pointData,
		x: pointData.x + translation[0],
		y: pointData.y + translation[1]
	}
}));
const scaleGlyphPoint = (scale: number) => ((glyphPoint: GlyphPoint) : GlyphPoint => identity({ ...glyphPoint, x: glyphPoint.x * scale, y: glyphPoint.y * scale }));
export const scaleContours = (scale: number, contours: Contour[]) => map((contour: Contour) => map(scaleGlyphPoint(scale), contour))(contours);

export const getGlyphContours = (glyph: Glyph) : Contour[] => {
    //this has to be called to make contours available strangely
    glyph.getPath();
    return glyph.getContours();
};
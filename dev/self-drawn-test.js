import { 
	loadFontsAsync, getInterspersedContour, pathContours, getGlyphByIndex, getGlyphIndexByName, pathInterspersedContours, getGlyphByName, getGlyphContours
} from '../src/opentype-util.js';
import * as R from 'ramda';
import { addFontFaces } from '../src/util';

import {
	createDelimiter
} from '../src/delimiter-util.js/index.js.js';
import { createRoot } from './root-util.js';

const createRangeIndexArray = (min, max) => {
	const length = max - min;
	const arr = [];
	for (let i = min; i < max; i++){
		arr.push(i);
	}
	return arr;
};
const interpolate = (a, b, t) => a + (b - a) * t;
const mapRange = (fromStart, fromEnd, toStart, toEnd, val) => {
	const scale = (toEnd - toStart) / (fromEnd - fromStart);
	return toStart + (val - fromStart) * scale;
};

const loadFonts = async () => {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const fontEntries = [
		["KaTeX_Main", "KaTeX_Main-Regular.ttf"],
		["KaTeX_Size1", "KaTeX_Size1-Regular.ttf"],
		["KaTeX_Size2", "KaTeX_Size2-Regular.ttf"],
		["KaTeX_Size3", "KaTeX_Size3-Regular.ttf"],
		["KaTeX_Size4", "KaTeX_Size4-Regular.ttf"]
	];
	const fontUrlMap = R.fromPairs(fontEntries.map(entry => [entry[0], baseUrl + entry[1]]));
	const fontMap = await loadFontsAsync(fontUrlMap);
	await addFontFaces(fontUrlMap);
	return fontMap;
};




const interpolateContours = (a, b, t) => a.map((p1, ind) => {
	return {
		...p1, 
		...R.fromPairs(["x", "y"].map(key => [key, interpolate(a[ind][key], b[ind][key], t)]))
	};
});
const interpolateContourArrays = (a, b, t) => a.map((arr1, ind) => interpolateContours(a[ind], b[ind], t));

const drawGlyphPoints = (ctx, contours) => {
	for (const contour of contours){
		for (const [index, pointData] of contour.entries()){
			const point = [pointData.x, pointData.y];
			ctx.save();
			ctx.translate(...point);

			ctx.beginPath();
			ctx.fillStyle = pointData.onCurve ? "blue" : "red";
			ctx.arc(0, 0, 1, 0, Math.PI * 2);
			ctx.fill();

			//ctx.font = "20px sans-serif";
			//ctx.fillText(index.toString(), 0, 0);

			ctx.restore();
		}
	}
};
const drawBoundingBox = (ctx, boundingBox) => {
	ctx.strokeRect(
		boundingBox.x1, boundingBox.y1, 
		boundingBox.x2 - boundingBox.x1, 
		boundingBox.y2 - boundingBox.y1
	);
};
const drawDebugContour = (ctx, contour) => {
	const allPoints = getInterspersedContour(contour);	

	const polyline = allPoints.map(p => p.point);
	ctx.moveTo(...polyline[0]);
	polyline.slice(1).forEach(point => ctx.lineTo(...point));
	ctx.stroke();

	pathInterspersedContours(ctx, [allPoints]);
	ctx.stroke();

	for (let i = 0; i < contour.length; i++){
		const pointData = contour[i];
		
		ctx.beginPath();
		ctx.arc(pointData.x, pointData.y, 2, 0, Math.PI * 2);
		ctx.fill();
	}
};
const drawDebugContours = (ctx, contours) => contours.forEach(cont => drawDebugContour(ctx, cont));
const transformContour = (matrix, contour) => contour.map(pointData => {
	const transformedPoint = transformPoint(matrix, [pointData.x, pointData.y]);
	return {
		...pointData,
		x: transformedPoint[0],
		y: transformedPoint[1]
	};
});

const glyphNameToChar = (font, glyphName) => {
	return String.fromCharCode(getGlyphByName(font, glyphName).unicode);
};

const test1 = async () => {

	const fonts = await loadFonts();

	document.body.insertAdjacentHTML("beforeend", `
		<div>
			<input 
				type="range" min="0" max="500" value="0" step="0.01" 
				style="display: inline-block; width: 400px;" 
			/>
			<canvas width="1200" height="600"></canvas>
		</div>
	`);

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	const fontKeys = Reflect.ownKeys(fonts);
	
	const fontSize = 600;
	const scale = fontSize / 1000;
	const char = "(";
	
	const glyphs = fontKeys.map(key => fonts[key].charToGlyph(char));
	//need to call this to make contours available weirdly
	glyphs.forEach(glyph => glyph.getPath());
	
	let stretchFactor = 1;

	const render = () => {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.translate(0, -0);
		
		ctx.scale(scale, scale);
		ctx.lineWidth = 2 / scale;

		let contours = glyphs[2].getContours();
		const contour = contours[0];
		const pointCount = contour.length;
		const upShiftedIndices = [
			...createRangeIndexArray(0, 7),
			...createRangeIndexArray(25, pointCount)
		];
		const downShiftedIndices = createRangeIndexArray(10, 22);
		const absYOffsets = contour.map((point, ind) => upShiftedIndices.includes(ind) ? -stretchFactor : (downShiftedIndices.includes(ind) ? stretchFactor : 0));
		const relShiftIndices = [7, 9, 22, 24];
		const relYOffsets = relShiftIndices.map(ind => mapRange(contour[ind - 1].y, contour[ind + 1].y, absYOffsets[ind - 1], absYOffsets[ind + 1], contour[ind].y));
		const yOffsets = absYOffsets.map((offset, ind) => relShiftIndices.includes(ind) ? relYOffsets[relShiftIndices.indexOf(ind)] : offset);
		contours = [
			contour.map((point, ind) => {
				return { ...point, y: point.y + yOffsets[ind] };
			})
		];

		drawDebugContour(ctx, contours[0]);
		// ctx.beginPath();
		// pathGlyphContours(ctx, contours);
		// ctx.stroke();
		//drawGlyphPoints(ctx, contours);

		ctx.restore();
	};
	
	document.querySelector("input").addEventListener("input", e => {
		stretchFactor = parseFloat(e.srcElement.value);
		render();
	});

	render();
};

const testDelimFitting = async () => {

	const fonts = await loadFonts();

	document.body.insertAdjacentHTML("beforeend", `
		<div>
			<div style="display: flex; flex-direction: column;">
				<input 
					type="range" min="0" max="3000" value="400" step="0.01" 
					style="display: inline-block; width: 400px;" 
				/>
				<input 
					type="range" min="0" max="3000" value="400" step="0.01" 
					style="display: inline-block; width: 400px;" 
				/>
			</div>
			<canvas width="1000" height="500"></canvas>
		</div>
	`);

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	const fontKeys = Reflect.ownKeys(fonts);
	
	const fontSize = 30;
	const scale = fontSize / 1000;
	
	let fitDim = {
		height: 400,
		depth: -400
	};

	const render = () => {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		
		//axes
		{
			ctx.beginPath();
			ctx.moveTo(-1000, 0);
			ctx.lineTo(1000, 0);
			ctx.moveTo(0, -1000);
			ctx.lineTo(0, 1000);
			ctx.stroke();
		}

		
		//fit rects
		{
			ctx.save();
			ctx.scale(scale, scale);
			ctx.fillStyle = "orange";
			ctx.fillRect(0, 0, 100, fitDim.height);
			ctx.fillStyle = "blue";
			ctx.fillRect(0, fitDim.depth, 100, -fitDim.depth);
			ctx.restore();
		}

		const axisHeight = 250;
		const delimName = "parenright";
		const parenthesis = createDelimiter(fonts, delimName, fitDim.height, fitDim.depth);
		if (parenthesis.type === "char"){
			ctx.font = `${fontSize}px ${parenthesis.fontName}`;
			const char = glyphNameToChar(fonts[parenthesis.fontName], delimName);
			ctx.fillText(char, 0, (fontSize * axisHeight) / 1000);
		}
		else {
			ctx.scale(scale, scale);
			ctx.translate(0, -axisHeight);
			pathContours(ctx, parenthesis.contours);
			ctx.fill();
		}



		ctx.restore();
	};
	
	Array.from(document.querySelectorAll("input")).forEach((input, ind) => {
		const key = ["height", "depth"][ind];
		const sign = ind === 0 ? 1 : -1;
		input.addEventListener("input", e => {
			fitDim = {
				...fitDim,
				[key]: sign * parseFloat(e.srcElement.value)
			};
			render();
		});
	});

	render();
};

const testRootFitting = async () => {
	const fonts = await loadFonts();

	document.body.insertAdjacentHTML("beforeend", `
		<div>
			<div style="display: flex; flex-direction: column;">
				<input 
					type="range" min="0" max="5000" value="100" step="0.01" 
					style="display: inline-block; width: 400px;" 
				/>
				<input 
					type="range" min="0" max="5000" value="40" step="0.01" 
					style="display: inline-block; width: 400px;" 
				/>
			</div>
			<canvas width="1000" height="500"></canvas>
		</div>
	`);

	Array.from(document.querySelectorAll("input")).forEach((inp, index) => {
		const props = ["width", "height"];
		inp.addEventListener("input", e => {
			fitDim[props[index]] = parseFloat(e.srcElement.value);
			render();
		});
	});

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	const fontSize = 50;
	const scale = fontSize / 1000;
	
	let fitDim = {
		width: 100,
		height: 50
	};

	const render = () => {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.scale(scale, -scale);
		
		//axes
		{
			ctx.beginPath();
			ctx.moveTo(-1000000, 0);
			ctx.lineTo(1000000, 0);
			ctx.moveTo(0, -1000000);
			ctx.lineTo(0, 1000000);
			ctx.lineWidth = 40;
			ctx.stroke();
		}
		
		//fit rects
		ctx.fillStyle = "blue";
		ctx.fillRect(0, 0, fitDim.width, fitDim.height);

		const root = createRoot(fonts, fitDim.width, fitDim.height, 200);
		const translation = [
			-root.innerStartX,
			-root.metrics.yMin - (root.metrics.yMax - root.metrics.yMin - fitDim.height) / 2
		];

		ctx.translate(...translation);
		pathContours(ctx, root.contours);
		ctx.fill();

		ctx.fillRect(...root.indexCorner, 40, 40);

		// if (parenthesis.type === "char"){
		// 	ctx.font = `${fontSize}px ${parenthesis.fontName}`;
		// 	const char = glyphNameToChar(fonts[parenthesis.fontName], delimName);
		// 	ctx.fillText(char, 0, (fontSize * axisHeight) / 1000);
		// }
		// else {
		// 	ctx.scale(scale, scale);
		// 	ctx.translate(0, -axisHeight);
		// 	pathContours(ctx, parenthesis.contours);
		// 	ctx.fill();
		// }

		ctx.restore();
	};

	render();
};


import fontMetrics from './fontMetricsData.js';
const testFontMetrics = async () => {
	const fonts = await loadFonts();

	document.body.insertAdjacentHTML("beforeend", `
		<canvas width="1000" height="500"></canvas>
	`);

	const canvas = document.querySelector("canvas");
	const ctx = canvas.getContext("2d");

	const fontSize = 50;
	const scale = fontSize / 1000;

	const fontNameBase = "Size2";
	const fontName = `KaTeX_${fontNameBase}`;
	const metricsKey = `${fontNameBase}-Regular`;
	const glyphName = "integral";
	const glyph = fonts[fontName].nameToGlyph(glyphName);
	const metrics = fontMetrics[metricsKey][glyph.unicode].map(val => val * 1000);
	console.log(metrics, glyph);
	
	const render = () => {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.scale(scale, -scale);
		
		//axes
		{
			ctx.beginPath();
			ctx.moveTo(-1000000, 0);
			ctx.lineTo(1000000, 0);
			ctx.moveTo(0, -1000000);
			ctx.lineTo(0, 1000000);
			ctx.lineWidth = 40;
			ctx.stroke();
		}

		pathContours(ctx, getGlyphContours(glyph));
		ctx.fill();

		//bounding box
		// ctx.beginPath();
		// ctx.rect(glyph.xMin, glyph.yMin, glyph.xMax - glyph.xMin, glyph.yMax - glyph.yMin);
		// ctx.lineWidth = 10;
		// ctx.stroke();

		//metrics
		ctx.beginPath();
		ctx.rect(0, -metrics[0], metrics[4], metrics[0] + metrics[1]);
		ctx.lineWidth = 10;
		ctx.stroke();

		ctx.restore();
	};

	render();
};
testFontMetrics();
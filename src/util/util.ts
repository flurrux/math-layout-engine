export const sum = (nums: number[]): number => nums.reduce((_sum: number, num: number) => _sum + num, 0);
export const objectToArray = (obj: object): any[] => Reflect.ownKeys(obj).map(key => obj[key]);
export const pickList = (keys: string[], obj: object) => keys.map(key => obj[key]);
export const addFontFaces = async (fontMap: object) => {
	const FontFace = (window as any).FontFace;
	const fonts = (document as any).fonts;
	
    const keys = Reflect.ownKeys(fontMap);
    for (const fontKey of keys) {
		const url: string = fontMap[fontKey];
		const katexFace = new FontFace(fontKey, `url(${url})`);
		fonts.add(katexFace);
		await katexFace.load();
	}
};

//this function sums up all the numbers and records the intermediate sums along the way
export const accumSum = (nums: number[]) : number[] => nums.reduce((accum, num) => [...accum, accum[accum.length - 1] + num], [0]);

export const clamp = (min: number, max: number, val: number): number => {
	if (val < min) return min;
	if (val > max) return max;
	return val;
};
export const isDefined = (obj: any) : boolean => obj !== undefined;

const spread = (func: Function) => ((arr: any[]) => func(...arr));
export const min: ((input: number[]) => number) = spread(Math.min);
export const max: ((input: number[]) => number) = spread(Math.max);

import { fromPairs } from 'ramda';
export const removeKeys = (keys: string[]) => ((obj: object) => {
	return fromPairs((Object as any).entries(obj).filter((entry: string) => !keys.includes(entry[0])));
});


import { BoxCharNode } from '../layout/char-layout';
import { getMetricsObject } from '../font-data/katex-font-util';
export const getMetricsOfCharNode = (node: BoxCharNode) => getMetricsObject(node.style.fontFamily, node.style.emphasis, node.unicode);
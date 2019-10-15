export const sum = nums => nums.reduce((_sum, num) => _sum + num, 0);
export const objectToArray = obj => Reflect.ownKeys(obj).map(key => obj[key]);
export const pickList = (keys, obj) => keys.map(key => obj[key]);
export const addFontFaces = async fontMap => {
    const keys = Reflect.ownKeys(fontMap);
    for (const fontKey of keys) {
		const url = fontMap[fontKey];
		const katexFace = new FontFace(fontKey, `url(${url})`);
		document.fonts.add(katexFace);
		await katexFace.load();
	}
};

//this function sums up all the numbers and records the intermediate sums along the way
export const accumSum = (nums) => nums.reduce((accum, num) => [...accum, accum[accum.length - 1] + num], [0]);
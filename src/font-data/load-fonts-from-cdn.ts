import { addFontFaces } from "../util/util";
import { fontIdentifiers } from "./katex-font-util";


export const loadKatexFontFacesFromCDN = async () => {
	await addFontFaces(makeCdnFontMap());
};

function makeCdnFontMap(): Record<string, string> {
	const baseUrl = "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/";
	const katexPrefix = "KaTeX_";

	const fontUrlMap: Record<string, string> = (
		fontIdentifiers.reduce(
			(urlMap, key) => Object.assign(
				urlMap,
				{ [katexPrefix + key]: `${baseUrl}${katexPrefix}${key}.ttf` }
			),
			{} // initial, empty map
		)
	);

	return fontUrlMap;
};
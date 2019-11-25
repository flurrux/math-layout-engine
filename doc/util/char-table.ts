import { html as litHtml } from 'lit-html';
import { aliasMap, lookUpFamilyNameByUnicode, getDefaultEmphasis } from '../../src/font-data/katex-font-util';
import { pipe, map } from 'ramda';
import './char-table-element';




interface CharAliasMap {
	char: string,
	fontFamily: string,
	alias: string[]
}
const getAliasEntryByUnicode = (unicode: number) => aliasMap.find(entry => entry.unicode === unicode);
const aliasMapFromUnicode = (unicode: number) : CharAliasMap => {
	const char = String.fromCharCode(unicode);
	const entry = getAliasEntryByUnicode(unicode);
	if (!entry){
		const fontData = lookUpFamilyNameByUnicode(unicode);
		return { 
			char, 
			fontFamily: `${fontData.fontFamily}-${fontData.emphasis}`,
			alias: []
		}
	}
	return {
		char, 
		fontFamily: `${entry.fontFamily}-${getDefaultEmphasis(entry.fontFamily)}`, 
		alias: entry.alias
	}
};
const aliasMapFromUnicodes = (unicodes: number[]) : CharAliasMap[] => unicodes.map(aliasMapFromUnicode);
const normalizeUnicode = (input: string | number) : number => typeof(input) === "string" ? (input as string).charCodeAt(0) : (input as number);


export const charTableTemplate = (title: string, unicodes: (string|number)[]) => litHtml`
	<char-table-element 
		.title=${title} 
		.charAliasMap=${pipe(map(normalizeUnicode), aliasMapFromUnicodes)(unicodes)}
	></char-table-element>
`;
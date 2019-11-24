import { html } from 'lit-html';

interface CharAliasMap {
	char: string,
	aliases: string[]
}
type CharAliasSpec = { char: string | number, aliases?: string[] | string } | string;
const normalizeChar = (input: string | number): string => typeof (input) === "number" ? String.fromCharCode(input) : input;
const normalizeCharAliasEntry = (entry: CharAliasSpec): CharAliasMap => {
	const isString = typeof (entry) === "string";
	return {
		char: isString ? (entry as string) : normalizeChar((entry as any).char),
		aliases: (isString ? [] : (entry as any).aliases)
	};
};
const aliasCharTemplate = (entry: CharAliasMap) => html`
	<div style="min-width: 42px; min-height: 42px; display: flex; flex-direction: column; border: 1.3px solid white;">
		<span style="display: flex; align-items: center; justify-content: center; flex: 1;">
			${entry.char}
		</span>
		
		<div style="display: flex; flex-direction: column;">
			${entry.aliases.slice(0, 1).map(alias => html`
				<span style="text-align: center; border-top: 1px solid white; padding: 2px 3px 2px 3px;">
					${alias}
				</span>
			`)}	
		</div>
	</div>
`;
export const charTableTemplate = (title: string, aliasMap: CharAliasSpec[]) => html`
	<h3>${title}</h3>
	<div style="display: flex;">
		${
	aliasMap
		.map(normalizeCharAliasEntry)
		.map(aliasCharTemplate)
	}	
	</div>
`;
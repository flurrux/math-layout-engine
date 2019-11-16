import * as marked from 'marked';

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/hybrid.css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);

import { loadKatexFontFaces } from '../src/rendering/render';
import { markdownStr } from './markdown-text';


(async () => {
	await loadKatexFontFaces();
	const html = marked.parse(markdownStr, {
		highlight: (code: string, lang: string, callback) => {
			return hljs.highlight(lang, code, true).value
		}
	});
    document.body.querySelector("#page").innerHTML = html;
})();
import * as marked from 'marked';

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/hybrid.css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);

const parsingOpt = {
    highlight: (code, lang) => {
		return hljs.highlight(lang, code, true).value
	}
};


import { LitElement, html, css } from 'lit-element';

class MarkdownElement extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
            }
            a {
                color: #91caca
            }
            .markdown-container > pre {
                max-width: 100%;
                overflow-x: auto;
                width: fit-content;
                padding: 16px;
                border-radius: 4px;
                background-color: #e6e6e608;
            }

            /*

            vim-hybrid theme by w0ng (https://github.com/w0ng/vim-hybrid)

            */

            /*background color*/
            .hljs {
            display: block;
            overflow-x: auto;
            padding: 0.5em;
            background: #1d1f21;
            }

            /*selection color*/
            .hljs::selection,
            .hljs span::selection {
            background: #373b41;
            }

            .hljs::-moz-selection,
            .hljs span::-moz-selection {
            background: #373b41;
            }

            /*foreground color*/
            .hljs {
            color: #c5c8c6;
            }

            /*color: fg_yellow*/
            .hljs-title,
            .hljs-name {
            color: #f0c674;
            }

            /*color: fg_comment*/
            .hljs-comment,
            .hljs-meta,
            .hljs-meta .hljs-keyword {
            color: #707880;
            }

            /*color: fg_red*/
            .hljs-number,
            .hljs-symbol,
            .hljs-literal,
            .hljs-deletion,
            .hljs-link {
            color: #cc6666
            }

            /*color: fg_green*/
            .hljs-string,
            .hljs-doctag,
            .hljs-addition,
            .hljs-regexp,
            .hljs-selector-attr,
            .hljs-selector-pseudo {
            color: #b5bd68;
            }

            /*color: fg_purple*/
            .hljs-attribute,
            .hljs-code,
            .hljs-selector-id {
            color: #b294bb;
            }

            /*color: fg_blue*/
            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-bullet,
            .hljs-tag {
            color: #81a2be;
            }

            /*color: fg_aqua*/
            .hljs-subst,
            .hljs-variable,
            .hljs-template-tag,
            .hljs-template-variable {
            color: #8abeb7;
            }

            /*color: fg_orange*/
            .hljs-type,
            .hljs-built_in,
            .hljs-builtin-name,
            .hljs-quote,
            .hljs-section,
            .hljs-selector-class {
            color: #de935f;
            }

            .hljs-emphasis {
            font-style: italic;
            }

            .hljs-strong {
            font-weight: bold;
            }
        `;
    }
    static get properties(){
        return {
            markdownString: { type: String }
        }
    }
    constructor(){
        super();
        this.markdownString = "";
    }
    updated(){
        this.shadowRoot.querySelector(".markdown-container").innerHTML = marked.parse(this.markdownString, parsingOpt);
    }
    render(){
        return html`
            <div class="markdown-container"></div>
        `;
    }
}
customElements.define("markdown-element", MarkdownElement);
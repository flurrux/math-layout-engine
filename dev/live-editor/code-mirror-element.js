import { LitElement, html, css } from 'lit-element';
import { fromTextArea } from 'codemirror';

class CodeMirrorElement extends LitElement {
	static get properties(){
		return css`
			:host {
				display: block;
			}
			.container {
				height: 100%;
			}
		`;
	}
	constructor(){
		super();
	}
	render(){
		return html`
			<div style="height: 100%;">
				<style>
					@import url(https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css)
				</style>
				<style>
					@import url(https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/theme/base16-dark.min.css)
				</style>
				<textarea></textarea>
			</div>
		`;
	}
	_init(){
		const textArea = this.shadowRoot.querySelector("textarea");
		const editor = fromTextArea(textArea, {
			lineNumbers: true,
			theme: "base16-dark"
		});
		this._editor = editor;
		editor.on("change", () => this.dispatchEvent(new CustomEvent("editor-changed", { detail: { text: editor.getValue() } })));
		Object.assign(editor.getWrapperElement().style, {
			fontSize: "20px",
			height: "100%",
		});
		this.dispatchEvent(new CustomEvent("first-updated", { detail: { editor } }));
	}
	firstUpdated(){
		this._init();
	}
}
customElements.define("code-mirror-element", CodeMirrorElement);
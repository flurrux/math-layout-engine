import { LitElement, html, css } from 'lit-element';
import { fromTextArea } from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/scroll/simplescrollbars';

const elementLoadPromise = (el) => new Promise(resolve => {
	el.onload = () => resolve();
});

class CodeMirrorElement extends LitElement {
	static get styles(){
		return css`
			:host {
				display: block;
			}
			.container {
				height: 100%;
			}
		`;
	}
	static get properties(){
		return {
			initialOptions: { type: Object }
		}
	}
	constructor(){
		super();
		this.initialOptions = {};
	}
	render(){
		return html`
			<div style="height: 100%;">
				<div class="dependencies">
					<style>
						@import url(https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.css)
					</style>
					<style>
						@import url(https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/theme/base16-dark.min.css)
					</style>
					<style>
						@import url(https://codemirror.net/addon/scroll/simplescrollbars.css)
					</style>
				</div>
				<textarea></textarea>
			</div>
		`;
	}
	_init(){
		const textArea = this.shadowRoot.querySelector("textarea");
		const editor = fromTextArea(textArea, {
			lineNumbers: true,
			theme: "base16-dark",
			mode: {
				name: "javascript",
				json: true
			},
			scrollbarStyle: "overlay",
			...this.initialOptions
		});
		this._editor = editor;
		editor.on("change", () => this.dispatchEvent(new CustomEvent("editor-changed", { detail: { text: editor.getValue() } })));
		Object.assign(editor.getWrapperElement().style, {
			fontSize: "18px",
			height: "100%",
		});
		editor.refresh();
		this.dispatchEvent(new CustomEvent("first-updated", { detail: { editor } }));
	}
	async _initAfterStylesLoaded(){
		const elementsToLoad = Array.from(this.shadowRoot.querySelector(".dependencies").children);
		await Promise.all(elementsToLoad.map(elementLoadPromise));
		this._init();
	}
	firstUpdated(){
		this._initAfterStylesLoaded();
	}
}
customElements.define("code-mirror-element", CodeMirrorElement);
import { LitElement, html, css } from 'lit-element';
import { fromTextArea } from 'codemirror';
console.log(fromTextArea);


class CodeMirrorElement extends LitElement {
	constructor(){
		super();
	}
	render(){
		return html`
			<textarea></textarea>
		`;
	}
}


class LiveMathLayoutEditor extends LitElement {
	static get styles(){
		return css`
		`;
	}
	static get properties(){
		return {
			text: { type: String }
		}
	}
	constructor(){
		super();
		Object.assign(this, {
			text: ""
		});
	}
	render(){
		return html`

		`;
	}
}
customElements.define("live-math-layout-editor", LiveMathLayoutEditor);
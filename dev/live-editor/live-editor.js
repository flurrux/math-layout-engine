import { LitElement, html, css } from 'lit-element';
import './code-mirror-element.js';
import '../resizable-canvas';
import '../select-element';

import { layoutNode } from '../../src/layout/layout';
import { centerNodeOnCanvas, renderFormulaLayout, loadKatexFontFaces } from '../../src/rendering/render';

class LiveMathLayoutEditor extends LitElement {
	static get styles(){
		return css`
			:host {
				display: block;
			}
			.pane-container {
				display: flex;
				height: 100%;
			}
			.code-input {
				display: flex;
				flex-direction: column;
				flex: 1;
			}
			code-mirror-element {
				flex: 1;
				overflow-y: scroll;
			}
			.output-container {
				flex: 1;
				display: flex;
			}
			resizable-canvas {
				flex: 1;
			}
			.current-error {
				padding: 10px;
				min-height: 40px;
				color: red;
				font-weight: bold;
			}
		`;
	}
	static get properties(){
		return {
			text: { type: String },
			currentError: { type: String },
			outputText: { type: String },
			codeExampleIndex: { type: Number }
		}
	}
	static get _exampleCode(){
		return {
			"fraction": {
				type: "fraction",
				numerator: {
					type: "ord", value: "alpha"
				},
				denominator: {
					type: "mathlist",
					items: [
						{ type: "ord", value: "1" },
						{ type: "bin", value: "+" },
						{
							type: "fraction",
							numerator: { type: "ord", value: "alpha" },
							denominator: { type: "ord", value: "beta" }
						}
					]
				}
			},
			"roots": 0
		}
	}
	constructor(){
		super();
		Object.assign(this, {
			text: "",
			currentError: "",
			outputText: "",
			codeExampleIndex: -1
		});
		loadKatexFontFaces();
	}
	updated(changedProps){
		if (changedProps.has("text")){
			this.currentError = "";
			if (this._editor){
				this._editor.setValue(this.text);
			}
			try {
				const node = JSON.parse(this.text);
				const defaultStyle = {
					type: "D", 
					baseFontSize: 40,
					fontSize: 40,
				};
				const nodeLayouted = layoutNode({ ...node, style: defaultStyle });
				this._layoutedNode = nodeLayouted;
				this.outputText = JSON.stringify(nodeLayouted, null, 4);

				this._renderLayoutedNode();
			}
			catch (e){
				this.currentError = e.message;
			}
		}
		if (changedProps.has("codeExampleIndex")){
			if (this.codeExampleIndex > 0){
				this._showExample(this.codeExampleIndex - 1);
			}
		}
	}
	_initCanvas(canvas){
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
	}
	_renderLayoutedNode(){
		if (!this._canvas){
			return;
		}
		const canvas = this._canvas;
		const ctx = this._ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, this._layoutedNode));
	}
	_showExample(optionIndex){
		const keys = Reflect.ownKeys(LiveMathLayoutEditor._exampleCode);
		this.text = JSON.stringify(LiveMathLayoutEditor._exampleCode[keys[optionIndex]], null, 4);
	}
	render(){
		return html`
			<div class="pane-container">
				<div class="code-input">
					<select-element 
						.selectedIndex=${this.codeExampleIndex + 1} 
						.options=${[
							"custom",
							...Reflect.ownKeys(LiveMathLayoutEditor._exampleCode)
						]}
						@index-changed=${e => {
							this.codeExampleIndex = e.detail.selectedIndex;
						}}>
					</select-element>
					<code-mirror-element 
						@first-updated=${e => this._editor = e.detail.editor}
						@editor-changed=${e => this.text = e.detail.text}
					></code-mirror-element>
					<div class="current-error">${this.currentError}</div>
				</div>
				<div class="output-container">
					<resizable-canvas 
						@canvas-resized=${e => {
							if (this._layoutedNode){
								this._renderLayoutedNode();
							}
						}}
						@first-updated=${e => this._initCanvas(e.detail.canvas)}	
					></resizable-canvas>
				</div>
			</div>
		`;
	}
}
customElements.define("live-math-layout-editor", LiveMathLayoutEditor);


document.body.insertAdjacentHTML("beforeend", `
	<live-math-layout-editor style="height: 100%;"></live-math-layout-editor>
`);
import { LitElement, html, css } from 'lit-element';

import './code-mirror-element';
import '../elements/resizable-canvas';
import '../elements/select-element';

import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

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
			.pane-container > * {
				flex: 0 0 50%;
				margin-right: 4px;
				overflow-x: hidden;	
			}
			.code-input {
				display: flex;
				flex-direction: column;
			}
			code-mirror-element {
				flex: 1;
				overflow-y: hidden;
			}
			.output-container {
				display: flex;
				flex-direction: column;
				margin-left: 4px;
			}
			.canvas-container {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.current-error {
				padding: 10px;
				min-height: 40px;
				font-weight: bold;
				font-size: 22px;
			}
			.examples-picker {
				display: flex;
			}
			
			.top-bar {
				height: 54px;
				padding: 10px;
			}
			.bottom-bar {
				padding: 10px;
				height: 40px;
			}

			
		`;
	}
	static get properties(){
		return {
			text: { type: String },
			currentError: { type: String },
			outputText: { type: String },
			codeExampleIndex: { type: Number },
			outputMode: { type: String }
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
			"matrix": {
				type: "delimited",
				leftDelim: { type: "open", value: "[" },
				rightDelim: { type: "close", value: "]" },
				delimited: {
					type: "matrix",
					rowCount: 2,
					colCount: 2,
					items: [
						{ type: "ord", value: "a" },
						{ type: "ord", value: "b" },
						{ type: "ord", value: "c" },
						{ type: "ord", value: "d" },
					],
					style: {
						rowSpacing: 0.4,
						colSpacing: 0.4
					}
				} 
			},
			"root": {
				"type": "mathlist",
				 	"items": [
					{
					   	"type": "script",
					  	"nucleus": { "type": "ord", "value": "x" },
					   	"sub": {
						   "type": "mathlist",
						   "style": { "fontSize": 20 },
						   "items": [
							   	{ "type": "ord", "value": "1" },
							   	{ "type": "ord", "value": "," },
							   	{ "type": "ord", "value": "2" }
						   	] 
					   	}
				   	},
					{ "type": "rel", "value": "=" },
					{ "type": "ord", "value": "+-" },
					{ 
						"type": "root",
					   	"radicand": {
							"type": "mathlist",
							"items": [
								{ "type": "ord", "value": "q" },
								{ "type": "bin", "value": "+" },
								{
									"type": "fraction",
									"style": {
										"fontSize": 25
									},
									"numerator": { 
										"type": "script",
										"nucleus": {
											"type": "ord", "value": "p"
										},
										"sup": {
											"type": "ord", "value": "2"
										}
									},
									"denominator": { 
										"type": "ord", "value": "4" 
									}
							   	}
							]
					   }
				   	},
					{ "type": "bin", "value": "-" },
				   	{
						"type": "fraction",
						"style": {
							"fontSize": 25
						},
					   	"numerator": { 
						   	"type": "ord", "value": "p"
					   	},
					   	"denominator": { 
							"type": "ord", "value": "2" 
					   	}
				   	}
			   	]      
			},
			"accent": {
				"type": "mathlist",
				"items": [
					{
						"type": "accented",
						"nucleus": { "type": "ord", "value": "L" },
						"accent": { "type": "ord", "value": "vector" }
					},
					{ "type": "rel", "value": "=" },
					{
						"type": "accented",
						"nucleus": { "type": "ord", "value": "I" },
						"accent": { "type": "ord", "value": "~" }
					},
					{ "type": "bin", "value": "*" },
					{
						"type": "accented",
						"nucleus": { "type": "ord", "value": "w" },
						"accent": { "type": "ord", "value": "vector" }
					},
				]
			}   
		}
	}
	constructor(){
		super();
		Object.assign(this, {
			text: "",
			currentError: "",
			outputText: "",
			codeExampleIndex: -1,
			outputMode: "rendered"
		});
		loadKatexFontFaces();
	}
	_setText(newText){
		this.text = newText;
		this._editor.setValue(this.text);
	}
	updated(changedProps){
		if (changedProps.has("text")){
			this._tryProcessingText();
		}
		if (changedProps.has("codeExampleIndex")){
			if (this.codeExampleIndex >= 0){
				this._showExample(this.codeExampleIndex);
			}
		}
		if (changedProps.has("outputMode")){
			this._outputEditor.refresh();
		}
	}
	_tryProcessingText(){
		this.currentError = "";
		try {
			const node = JSON.parse(this.text);
			const defaultStyle = {
				type: "D", 
				fontSize: 40,
				...(node.style || {})
			};
			const style = {
				...defaultStyle,
				...(node.style || {})
			};
			const nodeLayouted = layoutNode({ ...node, style});
			this._layoutedNode = nodeLayouted;
			this.outputText = JSON.stringify(nodeLayouted, null, 4);
			this._outputEditor.setValue(this.outputText);
			
			const resizableCanvas = this.shadowRoot.querySelector("resizable-canvas");
			const padding = 32;
			Object.assign(resizableCanvas.style, {
				width: `${(nodeLayouted.dimensions.width + padding)}px`,
				height: `${(nodeLayouted.dimensions.yMax - nodeLayouted.dimensions.yMin + padding)}px`,
			});
		}
		catch (e){
			console.log(e);
			this.currentError = e.message;
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
		const color = "white";
		Object.assign(ctx, { fillStyle: color, strokeStyle: color });
		renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, this._layoutedNode));
	}
	_showExample(optionIndex){
		const keys = Reflect.ownKeys(LiveMathLayoutEditor._exampleCode);
		this._setText(JSON.stringify(LiveMathLayoutEditor._exampleCode[keys[optionIndex]], null, 4));
	}
	render(){
		const hasError = this.currentError !== "";
		return html`
			<div class="pane-container">
				<div class="code-input">
					<div class="top-bar">
						<div class="examples-picker">
							<custom-style>
								<style is="custom-style">
									paper-dropdown-menu {
										--paper-input-container-label: {
											color: #c5c5c5;
										};
										--paper-input-container-input: {
											color: white;
										};
									}
								</style>
							</custom-style>
							<paper-dropdown-menu 
								@iron-select=${e => {
									this.codeExampleIndex = [
										"custom", ...Reflect.ownKeys(LiveMathLayoutEditor._exampleCode)
									].indexOf(e.detail.item.textContent) - 1;
								}} 
								label="examples"
							>
								<paper-listbox slot="dropdown-content" selected=${this.codeExampleIndex + 1}>
									<paper-item>custom</paper-item>
									${Reflect.ownKeys(LiveMathLayoutEditor._exampleCode).map(key => html`
										<paper-item>${key}</paper-item>
									`)}
								</paper-listbox>
							</paper-dropdown-menu>
						</div>
					</div>
					<code-mirror-element 
						@first-updated=${e => this._editor = e.detail.editor}
						@editor-changed=${e => this.text = e.detail.text}
					></code-mirror-element>
					<div class="bottom-bar current-error" style="color: ${hasError ? "#d44040" : "#70ae70"};">
						${hasError ? this.currentError : "✓"}
					</div>
				</div>
				<div class="output-container">
					<div class="top-bar">
						<paper-tabs 
							selected=${["json", "rendered"].indexOf(this.outputMode)}
							@iron-select=${e => {
								this.outputMode = e.detail.item.innerText;
							}}
						>
							<paper-tab>json</paper-tab>
							<paper-tab>rendered</paper-tab>
						</paper-tabs>
						  
						<switch-button-group
							.values=${["json", "rendered"]}
							.activeValue=${this.outputMode}
							@value-changed=${e => this.outputMode = e.detail.activeValue}
						></switch-button-group>
					</div>
					<code-mirror-element 
						class="output-editor"
						style="display: ${this.outputMode === "json" ? "block" : "none"};"
						@first-updated=${e => {
							const editor = e.detail.editor;
							this._outputEditor = editor;
						}}
						.initialOptions=${{
							editable: false,
							foldGutter: true
						}}
					></code-mirror-element>	
					<div class="canvas-container" 
						style="display: ${this.outputMode === "rendered" ? "flex" : "none"};"
					>
						<resizable-canvas 
							@canvas-resized=${e => {
								if (this._layoutedNode){
									this._renderLayoutedNode();
								}
							}}
							@first-updated=${e => this._initCanvas(e.detail.canvas)}	
						></resizable-canvas>
					</div>
					<div class="bottom-bar"></div>
				</div>
			</div>
		`;
	}
}
customElements.define("live-math-layout-editor", LiveMathLayoutEditor);


document.body.insertAdjacentHTML("beforeend", `
	<live-math-layout-editor style="height: 100%;"></live-math-layout-editor>
`);

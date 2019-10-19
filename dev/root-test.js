import { extendRootTail, extendRootBrella, createRadical } from "../src/create-radical.js";
import { pathContours } from "../src/opentype-util";
import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-slider/paper-slider.js';

class RootExtensionTest extends LitElement {
	static get properties(){
		return {
			extensionWidth: { type: Number },
			extensionHeight: { type: Number },
			rootIndex: { type: Number }
		}
	}
	static get styles(){
		return css`
			:host {
				display: block;
				padding: 8px;
			}
			.container {
				display: flex; 
				flex-direction: row; 
				align-items: end;
			}
			.controls {
				display: grid;
				grid-template-columns: auto auto;
				margin-left: 20px;
			}
			.label {
				display: flex;
				align-items: center;
			}
			canvas {
				border: 1.4px solid gray;
			}
		`;
	}
	constructor(){
		super();
		this.extensionWidth = 1;
		this.extensionHeight = 2.6;
		this.rootIndex = 0;
	}
	firstUpdated(){
		this._canvas = this.shadowRoot.querySelector("canvas");
		this._ctx = this._canvas.getContext("2d");
	}
	updated(){
		this._renderCanvas(this._ctx, this._canvas);
	}
	render(){
		return html`
			<div class="container">
				<canvas width=800 height=400></canvas>
				<div class="controls">
					<div class="label">root-index</div>
					<paper-slider 
						pin min="0" max="4" step="1" value=${this.rootIndex}
						@immediate-value-change=${e => this.rootIndex = parseInt(e.srcElement.immediateValue)}
					></paper-slider>

					<div class="label">width</div>
					<paper-slider 
						pin min="0" max="8" step="0.01" value=${this.extensionWidth}
						@immediate-value-change=${e => this.extensionWidth = parseFloat(e.srcElement.immediateValue)}	
					></paper-slider>
					
					<div class="label">height</div>
					<paper-slider 
						pin min="0" max="8" step="0.01" value=${this.extensionHeight}
						@immediate-value-change=${e => this.extensionHeight = parseFloat(e.srcElement.immediateValue)}
					></paper-slider>
				</div>
			</div>
		`;
	}
	_renderCanvas(ctx, canvas){
		const { rootIndex, extensionWidth, extensionHeight } = this;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		const scale = 50;
		ctx.setTransform(scale, 0, 0, -scale, canvas.width / 2 - 100, canvas.height / 2);
		const contour = rootIndex < 4 ? extendRootTail(rootIndex, extensionWidth) : extendRootBrella(extensionHeight, extensionWidth);
		pathContours(ctx, [contour]);
		ctx.fill();
		ctx.restore();
	}
}
customElements.define("root-extension-test", RootExtensionTest);


class RootCreationTest extends LitElement {
	static get properties() {
		return {
			fitWidth: { type: Number },
			fitHeight: { type: Number },
			margin: { type: Number }
		}
	}
	static get styles() {
		return css`
			:host {
				display: block;
				padding: 8px;
			}
			.container {
				display: flex; 
				flex-direction: row; 
				align-items: end;
			}
			.controls {
				display: grid;
				grid-template-columns: auto auto;
				margin-left: 20px;
			}
			.label {
				display: flex;
				align-items: center;
			}
			canvas {
				border: 1.4px solid gray;
			}
		`;
	}
	constructor() {
		super();
		this.fitWidth = 1;
		this.fitHeight = 2.6;
		this.margin = 0.1;
	}
	firstUpdated() {
		this._canvas = this.shadowRoot.querySelector("canvas");
		this._ctx = this._canvas.getContext("2d");
	}
	updated() {
		this._renderCanvas(this._ctx, this._canvas);
	}
	render() {
		return html`
			<div class="container">
				<canvas width=800 height=400></canvas>
				<div class="controls">
					<div class="label">width</div>
					<paper-slider 
						pin min="0" max="8" step="0.01" value=${this.fitWidth}
						@immediate-value-change=${e => this.fitWidth = parseFloat(e.srcElement.immediateValue)}	
					></paper-slider>
					
					<div class="label">height</div>
					<paper-slider 
						pin min="0" max="8" step="0.01" value=${this.fitHeight}
						@immediate-value-change=${e => this.fitHeight = parseFloat(e.srcElement.immediateValue)}
					></paper-slider>

					<div class="label">margin</div>
					<paper-slider
						pin min="0" max="1" step="0.01" value=${this.margin}
						@immediate-value-change=${e => this.margin = parseFloat(e.srcElement.immediateValue)}
					></paper-slider>
				</div>
			</div>
		`;
	}
	_renderCanvas(ctx, canvas) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		const scale = 50;
		const { fitWidth, fitHeight, margin } = this;
		const root = createRadical(fitWidth, fitHeight + margin);
		const position = [
			(canvas.width - root.metrics.width * scale) / 2, 
			canvas.height - 100 + root.metrics.yMin * scale
		];
		ctx.setTransform(scale, 0, 0, -scale, position[0], position[1]);
		
		pathContours(ctx, root.contours);
		ctx.fill();

		ctx.lineWidth = 0.03;
		ctx.strokeRect(root.innerStartX, root.metrics.yMin, fitWidth, fitHeight);

		ctx.restore();
	}
}
customElements.define("root-creation-test", RootCreationTest);


document.body.insertAdjacentHTML("beforeend", "<root-creation-test></root-creation-test>");
import { pathContours } from "../src/opentype-util";
import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-slider/paper-slider.js';
import { lookUpGlyphByHeightToAxis, createDelimiter } from "../src/create-delimiter";

const delimiterUnicodes = [
	40, 41, 123, 125,
	91, 93, 10216, 10217,
	8739, 8968, 8969,
	8970, 8971
];

const drawHorizontalLine = (ctx, x1, x2, y) => {
	ctx.beginPath();
	ctx.moveTo(x1, y);
	ctx.lineTo(x2, y);
	ctx.stroke();
};

class DelimiterByHeightTest extends LitElement {
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
	static get properties(){
		return {
			height: { type: Number },
		}
	}
	constructor(){
		super();
		this.height = 0.5;
	}
	_controlsTemplate(){
		return html`
			<div class="controls">
				<div class="label">height</div>
				<paper-slider 
					pin min="0" max="8" step="0.01" value=${this.height}
					@immediate-value-change=${e => this.height = parseFloat(e.srcElement.immediateValue)}
				></paper-slider>
			</div>
		`;
	}
	render(){
		return html`
			<div class="container">
				<canvas width=800 height=400></canvas>
				${this._controlsTemplate()}
			</div>
		`;
	}
	firstUpdated() {
		this._canvas = this.shadowRoot.querySelector("canvas");
		this._ctx = this._canvas.getContext("2d");
	}
	updated() {
		this._renderCanvas(this._ctx, this._canvas);
	}
	_renderCanvas(ctx, canvas){
		
		if (this.delimiterChar === "") {
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		
		const scale = 50;
		ctx.setTransform(scale, 0, 0, -scale, 0, canvas.height / 2);

		const { height } = this;


		const localCanvasWidth = canvas.width / scale;
		
		ctx.lineWidth = 0.03;
		ctx.strokeStyle = "black";
		drawHorizontalLine(ctx, 0, localCanvasWidth, 0);
		
		const heights = [0.5, 0.6, 0.9, 1.2, 1.5, 1.5];
		for (const threshHeight of heights){
			ctx.save();
			Object.assign(ctx, { globalAlpha: 0.3 });
			ctx.setLineDash([0.1, 0.1]);
			drawHorizontalLine(ctx, 0, localCanvasWidth, threshHeight);
			ctx.restore();
		}

		ctx.strokeStyle = "#666666";
		drawHorizontalLine(ctx, 0, localCanvasWidth, height);
		drawHorizontalLine(ctx, 0, localCanvasWidth, -height);


		ctx.translate(0, -0.25);
		for (let i = 0; i < delimiterUnicodes.length; i++){
			const unicode = delimiterUnicodes[i];
			const glyphEntry = createDelimiter(unicode, height);
			if (!glyphEntry) continue;

			ctx.save();
			ctx.translate(i * 1.1, 0);
			pathContours(ctx, glyphEntry.contours);
			ctx.fill();
			ctx.restore();
		}
		
		ctx.restore();
	}
}
customElements.define("delimiter-by-height-test", DelimiterByHeightTest);




document.body.insertAdjacentHTML("beforeend", "<delimiter-by-height-test></delimiter-by-height-test>");
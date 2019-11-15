
import { LitElement, html, css } from 'lit-element';
import '../elements/resizable-canvas';
import * as R from 'ramda';


const boolPropTemplate = (val, onChange) => html`
	<input type="checkbox" ?checked=${val} @input=${e => onChange(e.srcElement.checked)} />
`;
const floatPropTemplate = (val, onChange) => html`
	<input 
		type="text" value=${val} min="-2" max="2"	
		@input=${e => onChange(parseFloat(e.srcElement.value))} 
	/>
`;
const enumPropTemplate = (vals, val, onChange) => html`
	<div style="display: flex;">
		${vals.map(enumVal => html`
			<button ?disabled=${enumVal === val} @click=${e => onChange(enumVal)}>
				${enumVal}
			</button>	
		`)}
	</div>
`;
const getPropTemplateForType = (description) => {
	const { type } = description;
	if (type === "float") return floatPropTemplate;
	else if (type === "bool") return boolPropTemplate;
	else if (type === "enum"){
		return (val, onChange) => enumPropTemplate(description.values, val, onChange);
	}
	else if (type === "object"){
		return (val, onChange) => propertyMapInputTemplate(description.description, val, onChange);
	}
};
const propertyMapInputTemplate = (mapDescription, mapObj, onChange) => {
	const keys = Reflect.ownKeys(mapDescription);
	return html`
		<div style="
			display: grid; grid-template-columns: min-content min-content; grid-row-gap: 4px;
			border: 1px solid #ddd;
		">
			${keys.map(key => html`
				<span style="display: flex; align-items: center; margin-right: 10px;">${key}</span>
				${getPropTemplateForType(mapDescription[key])(mapObj[key], newVal => {
					onChange(R.assoc(key, newVal, mapObj))
				})}
			`)}
		</div>
	`;
};



import {
	strokeHorizontalLine, strokePolylineWithIdentityMatrix, fillFlippedText
} from '../ctx-util';
const drawMetricsBox = (metrics, position, ctx) => {
	ctx.save();
	ctx.translate(...position);
	ctx.beginPath();
	const { width, height, depth } = metrics;

	ctx.strokeStyle = "white";
	strokePolylineWithIdentityMatrix([[0, 0], [width, 0]], ctx, 1.4);
	strokePolylineWithIdentityMatrix([
		[0, height], [width, height], [width, depth], [0, depth], [0, height]
	], ctx, 1.4);

	ctx.restore();
};

const drawLabeledHorizontalLine = (x1, x2, y, label, scale, ctx) => {
	ctx.save();
	ctx.setLineDash([5, 5]);
	strokeHorizontalLine(x1, x2, y, 1.4)(ctx);
	Object.assign(ctx, {
		textAlign: "start",
		textBaseline: "middle",
		font: "1px sans-serif"
	});
	fillFlippedText(label, x2 + 0.04, y, scale)(ctx);
	ctx.restore();
};
// const fillText = (text, x, y, options, ctx) => {
// 	options = {
// 		textAlign: "start",
// 		textBaseline: "alphabetic",
// 		fontSize: 12,
// 		...options
// 	};
// 	ctx.save();
// 	ctx.translate(x, y);
// 	ctx.scale(1, -1);
// 	ctx.setTransform(1, 0, 0, 1, 0, 0);
// 	ctx.fillRect(0, 0, 10, 10);
// 	Object.assign(ctx, {
// 		font: `sans-serif ${options.fontSize}px`,
// 		textAlign: options.textAlign,
// 		textBasline: options.textBaseline
// 	});
// 	// ctx.fillText(text, 0, 0);
// 	ctx.restore();
// };



const layoutScript = (data) => {
	const { nucleusNode, parameters } = data;
	const nucleusMetrics = nucleusNode.metrics;
	const target1 = nucleusNode.isChar ? [0, 0] : [
		nucleusMetrics.height + parameters.sup_drop,
		nucleusMetrics.depth + parameters.sub_drop
	];

	const { superscriptNode, subscriptNode, style } = data;
	const layoutData = {};

	if (!subscriptNode.empty){
		layoutData.subPosition = [
			nucleusMetrics.width,
			superscriptNode.empty ? Math.min(target1[1], parameters.sub1, 0.8 * parameters.x_height - subscriptNode.metrics.height) : 
				Math.min(target1[1], parameters.sub2)
		]
	}

	if (!superscriptNode.empty){
		layoutData.supPosition = [
			nucleusMetrics.width + nucleusMetrics.italicCorrection,
			Math.max(
				target1[0], style.type === "D" ? parameters.sup1 : ( style.cramped ? sup3 : sup2 ), 
				0.25 * parameters.x_height - superscriptNode.metrics.depth)
		]
	}

	if (!superscriptNode.empty && !subscriptNode.empty){
		const superscriptBottom = layoutData.supPosition[1] + superscriptNode.metrics.depth;
		const subscriptTop = layoutData.subPosition[1] + subscriptNode.metrics.height;
		const defaultRuleThickness = 0.01;
		layoutData.subPosition[1] += Math.min(0, superscriptBottom - 4 * defaultRuleThickness - subscriptTop);
		const superScriptOnXHeightShift = Math.max(0, 0.8 * parameters.x_height - superscriptBottom);
		layoutData.supPosition[1] += superScriptOnXHeightShift;
		layoutData.subPosition[1] += superScriptOnXHeightShift;
	}

	return layoutData;
};


class ScriptLayoutFiddleElement extends LitElement {
	static get styles(){
		return css`
			:host {
				display: block;
			}
			resizable-canvas {
				border: 1px solid #ddd;
				width: 600px;
				height: 400px;
			}
		`;
	}
	static get properties(){
		return {
			data: { type: Object }
		};
	}
	
	constructor(){
		super();
		Object.assign(this, {
			data: {
				style: {
					type: "D",
					cramped: false
				},
				nucleusNode: {
					isChar: false,
					metrics: {
						width: 0.5,
						height: 0.4,
						depth: -0.3,
						italicCorrection: 0
					}
				},
				superscriptNode: {
					empty: false,
					metrics: {
						width: 0.1,
						height: 0.1,
						depth: -0.1
					}
				},
				subscriptNode: {
					empty: true,
					metrics: {
						width: 0.1,
						height: 0.1,
						depth: -0.1
					}
				},
				parameters: {
					x_height: 0.45,
	
					sup_drop: 0,
					sub_drop: 0,
	
					sup1: 0,
					sup2: 0,
					sup3: 0,
					
					sub1: 0,
					sub2: 0	
				}
			},

			_canvas: null,
			_ctx: null
		});

		const smallScriptDescription = {
			type: "object",
			description: {
				empty: { type: "bool" },
				metrics: {
					type: "object",
					description: {
						width: { type: "float" },
						height: { type: "float" },
						depth: { type: "float" }
					}
				}
			}
		};
		this._dataDescription = {
			style: {
				type: "object",
				description: {
					type: {
						type: "enum",
						values: ["D", "T", "S", "SS"]
					},
					cramped: { type: "bool" }
				}
			},
			nucleusNode: {
				type: "object",
				description: {
					isChar: { type: "bool" },
					metrics: {
						type: "object",
						description: {
							width: { type: "float" },
							height: { type: "float" },
							depth: { type: "float" },
							italicCorrection: { type: "float" }
						}
					}
				}
			},
			superscriptNode: smallScriptDescription,
			subscriptNode: smallScriptDescription,
			parameters: {
				type: "object",
				description: {
					x_height: { type: "float" },
	
					sup_drop: { type: "float" },
					sub_drop: { type: "float" },
	
					sup1: { type: "float" },
					sup2: { type: "float" },
					sup3: { type: "float" },
					
					sub1: { type: "float" },
					sub2: { type: "float" }	
				}
			}
		};
	}
	render(){
		return html`
			<div style="display: flex;">
				<resizable-canvas
					@first-updated=${e => this._initCanvas(e.detail.canvas)}
					@canvas-resized=${e => this._prepareAndRenderOnCanvas()}
				>
				</resizable-canvas>
				<div style="flex: 1;">
					${propertyMapInputTemplate(this._dataDescription, this.data, newData => this.data = newData)}
				</div>
			</div>
		`;
	}
	updated(){
		this._prepareAndRenderOnCanvas();
	}
	_initCanvas(canvas){
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d");
		this._prepareAndRenderOnCanvas();
	}
	_prepareAndRenderOnCanvas(){
		if (!this._canvas){
			return;
		}
		const ctx = this._ctx;
		const canvas = this._canvas;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		this._renderOnCanvas(ctx, canvas);
		ctx.restore();
	}
	_renderOnCanvas(ctx, canvas){
		const fontSize = 150;
		const defaultFontScale = 16 / fontSize;
		Object.assign(ctx, {
			strokeStyle: "white",
			fillStyle: "white"
		});
		ctx.setTransform(fontSize, 0, 0, -fontSize, 50, canvas.height / 2);
		
		const { data } = this;
		const { nucleusNode, parameters } = data;

		const drawYParam = (val, label) => {
			drawLabeledHorizontalLine(0, lineLength, val, label, defaultFontScale, ctx);
		};

		const lineLength = 300 / fontSize;
		drawYParam(parameters.x_height, "x_height");
		if (!nucleusNode.isChar){
			drawYParam(nucleusNode.metrics.height + parameters.sup_drop, "height(nucleus) - sup_drop");
			drawYParam(nucleusNode.metrics.depth + parameters.sub_drop, "depth(nucleus) - sub_drop");
		}

		drawMetricsBox(data.nucleusNode.metrics, [0, 0], ctx);

		const layoutData = layoutScript(this.data);
		if (!data.superscriptNode.empty){
			drawMetricsBox(data.superscriptNode.metrics, layoutData.supPosition, ctx);
		}
		if (!data.subscriptNode.empty){
			drawMetricsBox(data.subscriptNode.metrics, layoutData.subPosition, ctx);
		}
	}
}
customElements.define("script-layout-fiddle-element", ScriptLayoutFiddleElement);
document.body.insertAdjacentHTML("beforeend", `
	<script-layout-fiddle-element></script-layout-fiddle-element>
`);
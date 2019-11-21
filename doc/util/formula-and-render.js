import { LitElement, html, css } from 'lit-element';
import { markdownCode } from './lit-marked';
import '../../dev/elements/resizable-canvas';
import { layoutFormula, renderFormulaLayout, centerNodeOnCanvas } from  '../../src/index';

class FormulaAndRenderElement extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
            }
            markdown-element {
                padding-right: 12px;
            }
        `;
    }
    static get properties(){
        return {
            formula: { type: String }
        }
    }
    constructor(){
        super();
        Object.assign(this, {
            formula: ""
        });
        document.fonts.onloadingdone = (fontFaceSetEvent) => {
            this._renderFormula();
        };
    }
    _setupCanvas(canvas){
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
    }
    _renderFormula(){
        if (!this._canvas){
            return;
        }
        const layouted = layoutFormula(JSON.parse(this.formula));
        const canvas = this._canvas;
        const ctx = this._ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        Object.assign(ctx, {
            strokeStyle: "white",
            fillStyle: "white"
        });
        const centeredPosition = calculateCenterPosition(canvas, layouted);
        const position = [Math.min(20, centeredPosition[0]), centeredPosition[1]];
        renderFormulaLayout(canvas, ctx, setPosition(position)(layouted));
        ctx.restore();
    }
    render(){
        return html`
            <div style="display: flex;">
                ${markdownCode(this.formula, "javascript")}
                <resizable-canvas
                    style="flex: 1;"
                    @first-updated=${e => {
                        this._setupCanvas(e.detail.canvas);
                        this._renderFormula();
                    }}
                    @canvas-resized=${e => this._renderFormula()}
                ></resizable-canvas>
            </div>
        `;
    }
}
customElements.define("formula-and-render", FormulaAndRenderElement);


import { html as litHtml } from 'lit-html';
import { calculateCenterPosition } from '../../src/rendering/render';
import { setPosition } from '../../src/layout/layout-util';
export const codeAndRender = (formula) => litHtml`
    <formula-and-render .formula=${formula}></formula-and-render>
`;
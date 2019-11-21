import { css, html, LitElement } from 'lit-element';
import '../../dev/elements/resizable-canvas';
import { renderFormulaLayout } from '../../src/index';
import { layout } from '../../src/layout/layout';
import { setPosition } from '../../src/layout/layout-util';

class FormulaRender extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
            }
        `
    }
    static get properties(){
        return {
            formula: { type: Object }
        }
    }
    constructor(){
        super();
        this.formula = {};
        document.fonts.addEventListener("loadingdone", () => this._renderFormula());
    }
    _renderFormula(){
        const layoutedFormula = layout(this.formula)
        const padding = 5;
        const { width, height } = {
            width: layoutedFormula.width + padding * 2,
            height: layoutedFormula.height + padding * 2
        }

        const canvas = this.shadowRoot.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        Object.assign(canvas, { width, height });
        Object.assign(ctx, { strokeStyle: "white", fillStyle: "white" });
        Object.assign(canvas.style, {
            width: `${width}px`,
            height: `${height}px`
        });
        renderFormulaLayout(canvas, ctx, setPosition([
            padding, -layoutedFormula.dimensions.yMin + padding]
        )(layoutedFormula));
    }
    updated(){
        this._renderFormula();
    }
    render(){
        return html`
            <canvas></canvas>
        `;
    }
}
customElements.define("formula-render", FormulaRender);

import { html as litHtml } from 'lit-html';
export const renderedFomula = (formula) => litHtml`
    <formula-render .formula=${formula}></formula-render>
`;
import { css, html, LitElement } from 'lit-element';
import { html as litHtml } from 'lit-html';
import { markdownCode } from './lit-marked';
import './formula-render';


class FormulaAndRenderElement extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
            }
            markdown-element {
                padding-right: 12px;
            }
            .container {
                display: flex; 
                flex-wrap: wrap;
                align-items: center;
            }
            formula-render {
                margin-left: 14px;
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
    }
    render(){
        return html`
            <div class="container">
                ${markdownCode(this.formula, "javascript")}
                <formula-render .formula=${JSON.parse(this.formula)}></formula-render>
            </div>
        `;
    }
}
customElements.define("formula-and-render", FormulaAndRenderElement);


export const codeAndRender = (formula) => litHtml`
    <formula-and-render .formula=${formula}></formula-and-render>
`;
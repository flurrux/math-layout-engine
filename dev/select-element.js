import { LitElement, html, css } from 'lit-element';

class SelectElement extends LitElement {
    static get properties(){
        return {
            selectedIndex: { type: Number },
            options: { type: Array }
        }
    }
    constructor(){
        super();
        Object.assign(this, {
            selectedIndex: 0,
            options: [] 
        });
    }
    render(){
        return html`
            <select @input=${e => this.dispatchEvent(new CustomEvent("index-changed", { detail: { selectedIndex: e.srcElement.selectedIndex } }))}>
                ${this.options.map(opt => html`<option>${opt}</option>`)}
            </select>
        `;
    }
    updated(){
        const select = this.shadowRoot.querySelector("select");
        select.selectedIndex = this.selectedIndex;
    }
}
customElements.define("select-element", SelectElement);
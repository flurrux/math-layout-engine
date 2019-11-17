import { LitElement, html, css } from 'lit-element';

class LabeledArrow extends LitElement {
	static get styles(){
		return css`
			:host {
				display: block;
			}
			.container {
				display: flex;
				flex-direction: column;
			}
		`;
	}
	static get properties(){
		return {
			label: { type: String }
		}
	}
	constructor(){
		super();
		this.label = "";
	}
	render(){
		return html`
			<div class="container">
				<div class="label">${this.label}</div>
				<svg height="32" width="0">
					<path d="" fill="white" stroke="none" />
				</svg>
			</div>
		`;
	}
	updated(){
		const labelEl = this.shadowRoot.querySelector(".label");
		const spacing = 10;
		labelEl.style.marginLeft = `${spacing}px`;
		const svgEl = this.shadowRoot.querySelector("svg");
		const [h1, h2, w1, w2] = [4, 6, labelEl.clientWidth + 2 * spacing, 16];
		const my = h1 + h2;
		svgEl.setAttribute("width", w1 + w2)
		svgEl.querySelector("path").setAttribute("d", `
			M0 ${h2} L${w1} ${h2} L${w1} 0 L${w1 + w2} ${my} 
			L${w1} ${(h1 + h2) * 2} L${w1} ${h2 + h1 * 2} L0 ${h2 + h1 * 2} Z
		`);
	}
}
customElements.define("labeled-arrow", LabeledArrow);
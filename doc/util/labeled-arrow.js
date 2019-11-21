import { LitElement, html, css } from 'lit-element';

class LabeledArrow extends LitElement {
	static get styles(){
		return css`
			:host {
				display: block;
			}
			.container {
				display: flex;
				align-items: flex-start;
			}
		`;
	}
	static get properties(){
		return {
			label: { type: String },
			direction: { type: String }
		}
	}
	constructor(){
		super();
		Object.assign(this, {
			label: "",
			direction: "horizontal"
		});
	}
	render(){
		return html`
			<div class="container" style="
				flex-direction: ${this.direction === "horizontal" ? "column" : "row-reverse"};
			">
				<span class="label">${this.label}</span>
				<svg height="0" width="0">
					<path d="" fill="white" stroke="none" />
				</svg>
			</div>
		`;
	}
	_updateLayout(){
		const labelEl = this.shadowRoot.querySelector(".label");
		labelEl.style.margin = "";
		const svgEl = this.shadowRoot.querySelector("svg");

		const dim = {
			halfBodySize: 4,
			halfHeadExtrusion: 6,
			headTipExtrusion: 16
		};
		const isHorizontal = this.direction === "horizontal";
		
		if (isHorizontal){
			const spacing = 10;
			labelEl.style.margin = `0 0 0 ${spacing}px`;

			const headX = labelEl.clientWidth + 2 * spacing;
			const [y1, y2, maxX, maxY] = [
				dim.halfHeadExtrusion, dim.halfHeadExtrusion + 2 * dim.halfBodySize, 
				headX + dim.headTipExtrusion, 2 * (dim.halfHeadExtrusion + dim.halfBodySize)];

			svgEl.setAttribute("width", maxX);
			svgEl.setAttribute("height", maxY);

			svgEl.querySelector("path").setAttribute("d", `
				M0 ${y1} L${headX} ${y1} L${headX} 0 L${maxX} ${maxY / 2} 
				L${headX} ${maxY} L${headX} ${y2} L0 ${y2} Z
			`);
		}
		else {
			const spacing = 6;
			labelEl.style.margin = `${spacing}px 0 0 0`;
			const headY = labelEl.clientHeight + 2 * spacing;
			const [x1, x2, maxX, maxY] = [
				dim.halfHeadExtrusion, dim.halfHeadExtrusion + 2 * dim.halfBodySize,
				2 * (dim.halfHeadExtrusion + dim.halfBodySize), headY + dim.headTipExtrusion
			];

			svgEl.setAttribute("width", maxX);
			svgEl.setAttribute("height", maxY);

			svgEl.querySelector("path").setAttribute("d", `
				M ${x1} 0 L${x2} 0 L${x2} ${headY} L${maxX} ${headY} 
				L${maxX / 2} ${maxY} L0 ${headY} L${x1} ${headY} Z
			`);
		}
	}
	updated(){
		this._updateLayout();
	}
	firstUpdated(){
		const label = this.shadowRoot.querySelector(".label");
		new ResizeObserver(() => this._updateLayout()).observe(label);
	}
}
customElements.define("labeled-arrow", LabeledArrow);
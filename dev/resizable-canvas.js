import { LitElement, html, css } from 'lit-element';

class ResizableCanvas extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
                position: relative;
            }
            .container {
                position: relative;
                overflow: hidden;
                width: 100%;
                height: 100%;
            }
            canvas {
                position: absolute;
            }
        `;
    }
    render(){
        return html`
            <div class="container">
                <canvas></canvas>
            </div>
        `;
    }
    firstUpdated(){
        const canvas = this.shadowRoot.querySelector("canvas");
        const outerEl = this.shadowRoot.querySelector(".container");
        const updateCanvasSize = () => {
            const [width, height] = [outerEl.clientWidth, outerEl.clientHeight];
            Object.assign(canvas, { width, height });
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            this.dispatchEvent(new CustomEvent("canvas-resized"));
        };
        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(outerEl);
        this.dispatchEvent(new CustomEvent("first-updated", { detail: { canvas: canvas } }));
    }
}
customElements.define("resizable-canvas", ResizableCanvas);
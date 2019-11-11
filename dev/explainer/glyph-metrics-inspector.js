import { LitElement, html, css } from 'lit-element';
import { getMetricsObject, styleWeightCombinationToEmphasis, fontData, lookUpGlyphByCharOrAlias } from '../../src/font-data/katex-font-util';
import fontMetricsData from '../../src/font-data/font-metrics-data';
import '../resizable-canvas';
import '../select-element';

import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

const lookUpFontFamiliesWithUnicode = (unicode) => fontData.filter(entry => {
    const metricKey = entry.name + "-" + entry.emphasis[0];
    const metrics = fontMetricsData[metricKey];
    return metrics[unicode] !== undefined;
}).map(entry => entry.name);

const hasFontStyleAndWeightCombination = (fontry, style, weight) => {
    return fontry.styleWeightCombinations.some(combo => combo[0] === style && combo[1] === weight);
};

const getRectFittingScale = (rect, availableSpaceRect) => {
    const aspectRatio = rect[1] / rect[0];
    const availableAspectRatio = availableSpaceRect[1] / availableSpaceRect[0];
    const scaleIndex = aspectRatio < availableAspectRatio ? 0 : 1;
    return availableSpaceRect[scaleIndex] / rect[scaleIndex];
};
const scaleAndCenterRect = (rect, availableSpaceRect, padding=0) => {
    const fittingScale = getRectFittingScale(rect, [
        availableSpaceRect[0] - padding * 2,
        availableSpaceRect[1] - padding * 2
    ]);
    const scaledRect = [rect[0] * fittingScale, rect[1] * fittingScale];
    return {
        scale: fittingScale,
        translation: [
            (availableSpaceRect[0] - scaledRect[0]) / 2,
            (availableSpaceRect[1] - scaledRect[1]) / 2,
        ]
    }
};

const pathPolyline = (ctx, points) => {
    ctx.moveTo(...points[0]);
    points.slice(1).forEach(point => ctx.lineTo(...point));
};
const strokePolyline = (points) => (ctx => {
    ctx.beginPath();
    pathPolyline(ctx, points);
    ctx.stroke();
});
const fillFlippedText = (text, x=0, y=0, scale=1) => (ctx => {
    ctx.save();
    ctx.translate(x, y);
    scaleUniform(scale)(ctx);
    ctx.scale(1, -1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
});
const scaleUniform = (scale) => (ctx => ctx.scale(scale, scale));

const fillCanvasCenteredText = (canvas, ctx, text) => {
    Object.assign(ctx, {
        textBaseline: "middle",
        textAlign: "center",
        font: "20px sans-serif",
    });
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
};








class GlyphMetricsInspector extends LitElement {
    static get styles(){
        return css`
            :host {
                display: block;
                width: 500px;
            }
            resizable-canvas {
                height: 300px;
                border: 1px solid #ddd;
            }
        `;
    }
    static get properties(){
        return {
            searchTerm: { type: String },
            fontFamily: { type: String },
            italic: { type: Boolean },
            bold: { type: Boolean },
            addItalicCorrection: { type: Boolean },
        };
    }
    constructor(){
        super();
        Object.assign(this, {
            searchTerm: "f",
            fontFamily: "Math",
            italic: true,
            bold: false
        });
        this._char = "f";
        this._unicode = this._char.charCodeAt(0);
    }
    _setSearchTerm(searchTerm){
        this.searchTerm = searchTerm;
        if (searchTerm === "") return;
        const unicode = lookUpGlyphByCharOrAlias(searchTerm).unicode;
        const char = String.fromCharCode(unicode);
        this._unicode = unicode;
        this._char = char;
        const fontFamilies = lookUpFontFamiliesWithUnicode(unicode);
        if (!fontFamilies.includes(this.fontFamily)){
            this._setFontFamily(fontFamilies[0] || "");
        }
    }
    _fontFamiliesTemplate(){
        const { searchTerm } = this;
        const fontFamilies = searchTerm === "" ? [] : lookUpFontFamiliesWithUnicode(this._unicode);
        const selectedIndex = fontFamilies.indexOf(this.fontFamily);
        return html`
            <select-element 
                .selectedIndex=${selectedIndex} 
                .options=${fontFamilies}
                @index-changed=${e => this._setFontFamily(fontFamilies[e.detail.selectedIndex])}>
            </select>
        `;
    }
    _setFontFamily(fontFamily){
        if (fontFamily === "" || fontFamily === this.fontFamily) {
            this.fontFamily = fontFamily;
            return;
        }
        const style = this.italic ? "italic" : "normal";
        const weight = this.bold ? "bold" : "normal";
        const fontry = fontData.find(entry => entry.name === fontFamily);
        const newComb = hasFontStyleAndWeightCombination(fontry, style, weight) ? [style, weight] : fontry.styleWeightCombinations[0];
        this.fontFamily = fontFamily;
        this.italic = newComb[0] === "italic";
        this.bold = newComb[1] === "bold";
    }
    _emphasisTemplate(){
        const fontry = fontData.find(entry => entry.name === this.fontFamily);
        if (!fontry) return;
        const emphasis = fontry.emphasis;
        const { italic, bold } = this;
        return html`
            <div>
                <label for="regular">regular</label> 
                <input 
                    type="radio" id="regular" name="emphasis" ?checked=${!italic && !bold} 
                    ?disabled=${!emphasis.includes("Regular")} 
                    @input=${e => Object.assign(this, { italic: false, bold: false })}/>
                <label for="italic">italic</label>
                <input 
                    type="radio" id="italic" name="emphasis" ?checked=${italic && !bold} 
                    ?disabled=${!emphasis.includes("Italic")} 
                    @input=${e => Object.assign(this, { italic: true, bold: false })}/>
                <label for="bold">bold</label>
                <input 
                    type="radio" id="bold" name="emphasis" ?checked=${!italic && bold} 
                    ?disabled=${!emphasis.includes("Bold")} 
                    @input=${e => Object.assign(this, { italic: false, bold: true })}/>
                <label for="bold-italic">bold-italic</label>    
                <input 
                    type="radio" id="bold-italic" name="emphasis" ?checked=${italic && bold} 
                    ?disabled=${!emphasis.includes("BoldItalic")} 
                    @input=${e => Object.assign(this, { italic: true, bold: true })}/>
            </div>
        `;
    }
    render(){
        return html`
            <div>
                <div>
                    <input value="${this.searchTerm}" @input=${e => this._setSearchTerm(e.srcElement.value)} />
                    ${this._fontFamiliesTemplate()}
                    <div style="display: flex; margin-top: 5px; margin-bottom: 5px;">
                        ${this._emphasisTemplate()}
                        <div style="flex: 1;"></div>
                        <div>
                            <label for="italic-correction"">italic-correction: </label>
                            <input id="italic-correction" type="checkbox" 
                                ?checked=${this.addItalicCorrection} 
                                @input=${e => this.addItalicCorrection = e.srcElement.checked} />
                        </div>
                    </div>
                </div>
                <resizable-canvas></resizable-canvas>
            </div>
        `;
    }
    firstUpdated(){
        const canvasContainer = this.shadowRoot.querySelector("resizable-canvas");
        canvasContainer.addEventListener("first-updated", () => {
            const canvas = canvasContainer.shadowRoot.querySelector("canvas");
            this._canvas = canvas;
            this._ctx = canvas.getContext("2d");
            this._prepareAndRenderOnCanvas();
        });
        canvasContainer.addEventListener("canvas-resized", () => this._prepareAndRenderOnCanvas());
    }
    updated(props){
        if (this._canvas){
            this._prepareAndRenderOnCanvas();
        }
    }
    _prepareAndRenderOnCanvas(){
        const canvas = this._canvas;
        const ctx = this._ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        this._renderOnCanvas(canvas, ctx);
        ctx.restore();
    }
    _renderOnCanvas(canvas, ctx){
        if (this.searchTerm === ""){
            fillCanvasCenteredText(canvas, ctx, "please input a character");
            return;
        }
        if (this.fontFamily === ""){
            fillCanvasCenteredText(canvas, ctx, "this character is not included in any of the fonts");
            return;
        }
        const char = this._char;
        const unicode = this._unicode;
        const { fontFamily } = this;
        const style = this.italic ? "italic" : "normal";
        const weight = this.bold ? "bold" : "normal";
        const emphasis = styleWeightCombinationToEmphasis(style, weight);
        const metrics = getMetricsObject(fontFamily, emphasis, unicode);
        const { addItalicCorrection } = this;

        //initial transform
        const fittingTransform = scaleAndCenterRect(
            [metrics.width, metrics.height + metrics.depth],
            [canvas.width - 150, canvas.height], 60
        );
        const scale = fittingTransform.scale;
        const translationY = metrics.depth * scale + fittingTransform.translation[1];
        const translation = [fittingTransform.translation[0] * 0.7, canvas.height - translationY];
        ctx.setTransform(scale, 0, 0, -scale, ...translation);

        const labelScale = 15 / scale;

        //glyph
        {
            ctx.save();
            ctx.font = `${this.italic ? "italic " : ""}${this.bold ? "bold " : ""}1px KaTeX_${fontFamily}`;
            fillFlippedText(char)(ctx);
            ctx.restore();
        }

        //origin
        {
            ctx.beginPath();
            ctx.arc(0, 0, 4 / scale, 0, Math.PI * 2);
            ctx.fill();
        }
        
        //metrics
        {
            ctx.lineWidth = 1.5 / scale;
            ctx.font = "1px sans-serif";
            const width = metrics.width + (addItalicCorrection ? metrics.italicCorrection : 0);

            ctx.strokeStyle = "black";
            
            strokePolyline([[0, 0], [width, 0]])(ctx);

            ctx.textAlign = "center";

            ctx.strokeStyle = "red";
            strokePolyline([[0, 0], [0, -metrics.depth], [width, -metrics.depth], [width, 0]])(ctx);

            ctx.strokeStyle = "green";
            strokePolyline([[0, 0], [0, metrics.height], [width, metrics.height], [width, 0]])(ctx);
        }

        //text
        {
            ctx.setTransform(1, 0, 0, -1, ...translation);
            const width = (metrics.width + (addItalicCorrection ? metrics.italicCorrection : 0)) * scale;
            ctx.font = "15px sans-serif";

            ctx.textBaseline = "middle";
            //origin
            ctx.textAlign = "end";
            fillFlippedText("(0, 0)", -10)(ctx);

            ctx.textAlign = "start";
            fillFlippedText(`width${addItalicCorrection ? " + italicCorrection" : ""}: ${metrics.width}`, width + 10)(ctx);


            ctx.textAlign = "center";

            ctx.textBaseline = "top";
            fillFlippedText("depth: " + metrics.depth, width / 2, -metrics.depth * scale - 10)(ctx);

            ctx.textBaseline = "bottom";
            fillFlippedText("height: " + metrics.height, width / 2, metrics.height * scale + 10)(ctx);
        }
    }
}
customElements.define("glyph-metrics-inspector", GlyphMetricsInspector);
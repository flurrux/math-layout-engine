import { LitElement, html, css } from 'lit-element';
import fontData from '../../src/font-data/font-metrics-data';

import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

import '@polymer/paper-checkbox/paper-checkbox.js';

const getValidEmphasisCombi = (currentCombi, validEmphasis) => {

};

const emphasisComboToString = (combo) => {
    if (!combo.italic && !combo.bold) return "Regular";
    if (!combo.italic && combo.bold) return "Bold";
    if (combo.italic && !combo.bold) return "Italic";
    if (combo.italic && combo.bold) return "BoldItalic";
};

class CharOverviewTable extends LitElement {
    static get styles(){
		return css`
			:host {
				display: block;
			}
			.glyph-container {
                display: flex; 
                flex-wrap: wrap; 
                font-size: 24px;
            }
            .glyph-container > div {
                min-width: 42px; 
                min-height: 42px; 
                border: 1px solid white; 
                display: flex; 
                align-items: center; 
                justify-content: center;
            }
            .glyph-container > div > span {
                padding: 4px;
            }
            paper-checkbox {
                margin-left: 6px;
                margin-right: 6px;
            }
            .input-container {
                display: flex; 
                align-items: baseline;
            }
            .input-container paper-checkbox {
                --primary-text-color: white;
            }
        `;
    }
    static get properties(){
        return {
            data: { type: Array },
            fontFamilyIndex: { type: Number },
            italic: { type: Boolean },
            bold: { type: Boolean }
        };
    }
    constructor(){
        super();
        this.data = [
            { fontFamily: "AMS", emphasis: ["Regular"] },
            { fontFamily: "Script", emphasis: ["Regular"] },
            { fontFamily: "Caligraphic", emphasis: ["Regular", "Bold"] },
            { fontFamily: "Fraktur", emphasis: ["Regular", "Bold"] },
            { fontFamily: "SansSerif", emphasis: ["Regular", "Italic", "Bold"] },
            { fontFamily: "Typewriter", emphasis: ["Regular"] },
            { fontFamily: "Main", emphasis: ["Regular", "Italic", "Bold", "BoldItalic"] },
            { fontFamily: "Math", emphasis: ["Italic", "BoldItalic"] },
            { fontFamily: "Size1", emphasis: ["Regular"] },
            { fontFamily: "Size2", emphasis: ["Regular"] },
            { fontFamily: "Size3", emphasis: ["Regular"] },
            { fontFamily: "Size4", emphasis: ["Regular"] }
        ];
        Object.assign(this, {
            fontFamilyIndex: 7,
            italic: true,
            bold: false
        });
    }
    _fontFamilyTemplate(){
        return html`
            <div class="font-family-picker">
                <custom-style>
                    <style is="custom-style">
                        paper-dropdown-menu {
                            --paper-input-container-label: {
                                color: #c5c5c5;
                            };
                            --paper-input-container-input: {
                                color: white;
                            };
                        }
                    </style>
                </custom-style>
                <paper-dropdown-menu 
                    @iron-select=${e => this.fontFamilyIndex = this.data.findIndex(entry => entry.fontFamily === e.detail.item.textContent)}
                    label="font-family"
                >
                    <paper-listbox slot="dropdown-content" selected=${this.fontFamilyIndex}>
                        ${this.data.map(entry => html`
                            <paper-item>${entry.fontFamily}</paper-item>
                        `)}
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>
        `;
    }
    render(){
        const entry = this.data[this.fontFamilyIndex];
        const emphasisStr = emphasisComboToString({ italic: this.italic, bold: this.bold });
        const isEmphasisValid = entry.emphasis.includes(emphasisStr);
        const key = `${entry.fontFamily}-${emphasisStr}`;
        return html`
            <div>
                <div class="input-container">
                    ${this._fontFamilyTemplate()}
                    <paper-checkbox 
                        ?checked=${this.italic}
                        @iron-change=${e => this.italic = e.srcElement.checked}>
                        italic
                    </paper-checkbox>
                    <paper-checkbox 
                        ?checked=${this.bold}
                        @iron-change=${e => this.bold = e.srcElement.checked}>
                        bold
                    </paper-checkbox>
                </div>
                ${isEmphasisValid ? html`
                    <div class="glyph-container" style="
                        font-family: KaTeX_${key}; 
                        display: ${isEmphasisValid ? "flex" : "none"}
                    ">
                        ${Reflect.ownKeys(fontData[key]).map(unicode => html`
                            <div>
                                <span>${String.fromCharCode(unicode)}</span>
                            </div>
                        `)}
                    </div>
                ` : html`
                    <div style="display: ${isEmphasisValid ? "none" : "block"}">
                        ${entry.fontFamily} does not contain emphasis ${emphasisStr}
                    </div>
                `}
            </div>
        `;
    }
}
customElements.define("char-overview-table", CharOverviewTable);
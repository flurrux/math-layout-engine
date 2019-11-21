import { LitElement, html, css } from 'lit-element';

class FontOverviewTable extends LitElement {
    static get styles(){
		return css`
			:host {
				display: block;
			}
			a {
				color: white;
			}
            #font-table thead {
                font-weight: bold;
            }
            #font-table td {
                padding: 5px 10px 5px 10px;
            }
            #font-table .example-chars {
                font-size: 24px;
            }
            #font-table tr {
                border-bottom: 1px solid #ddd;
            }
        `;
    }
    static get properties(){
        return {
            data: { type: Array }
        };
    }
    constructor(){
        super();
        this.data = [
            {
                fontFamily: "AMS",
                emphasis: ["Regular"],
                examples: "NZQRCħ≰∡"
            },
            {
                fontFamily: "Script",
                emphasis: ["Regular"],
                examples: "ABC"
            },
            {
                fontFamily: "Caligraphic",
                emphasis: ["Regular", "Bold"],
                examples: "123+abc"
            },
            {
                fontFamily: "Fraktur",
                emphasis: ["Regular", "Bold"],
                examples: "123+abc"
            },
            {
                fontFamily: "SansSerif",
                emphasis: ["Regular", "Italic", "Bold"],
                examples: "123+abc"
            },
            {
                fontFamily: "Typewriter",
                emphasis: ["Regular"],
                examples: "123+abc"
            },
            {
                fontFamily: "Main",
                emphasis: ["Regular", "Italic", "Bold", "BoldItalic"],
                examples: "123+abc-⋅"
            },
            {
                fontFamily: "Math",
                emphasis: ["Italic", "BoldItalic"],
                examples: "fxαμπ"
            },
            {
                fontFamily: "Size1",
                emphasis: ["Regular"],
                examples: "([⟨{∑∏∫"
            },
            {
                fontFamily: "Size2",
                emphasis: ["Regular"],
                examples: "([{⟨∑∏∫"
            },
            {
                fontFamily: "Size3",
                emphasis: ["Regular"],
                examples: "([{⟨"
            },
            {
                fontFamily: "Size4",
                emphasis: ["Regular"],
                examples: "([{⟨"
            }
		];
    }
    _fontEntryTemplate(fontEntry){
        const { fontFamily } = fontEntry;
        return html`
            <tr>
                <td>${fontFamily}</td>
                ${["Regular", "Italic", "Bold", "BoldItalic"].map(emph => html`
                    <td>
                        ${fontEntry.emphasis.includes(emph) ? html`
                            <a href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${fontFamily}-${emph}.ttf">✓</a>
                        ` : ""}
                    </td>
                `)}
                <td class="example-chars" style="font-family: KaTeX_${fontFamily}-${fontEntry.emphasis[0]};">
                    <span>
                        ${fontEntry.examples}
                    </span>
                </td>
            </tr>
        `;
    }
    render(){
        return html`
            <style>
                @font-face {
                    font-family: 'KaTeX_AMS';
                    src: url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_AMS-Regular.woff) format('woff');
                    font-weight: normal;
                    font-style: normal;
                }
            </style>
            <table id="font-table">
                <thead>
                    <tr>
                        <td>Font-Family</td>
                        <td>Regular</td>
                        <td>Italic</td>
                        <td>Bold</td>
                        <td>BoldItalic</td>
                        <td>examples</td>
                    </td>
                </thead>
                <tbody>
                    ${this.data.map(this._fontEntryTemplate.bind(this))}
                </tbody>
            </table>
        `;
    }
}
customElements.define("font-overview-table", FontOverviewTable);
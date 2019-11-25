import { LitElement, html, css } from 'lit-element';

class CharTableElement extends LitElement {
	static get styles(){
        return css`
            .char-table {
                display: flex;
                flex-wrap: wrap;
            }
            .char-entry {
                min-width: 42px; 
                min-height: 42px;
                margin: 2px;
                display: flex; 
                flex-direction: column; 
                border: 1.3px solid #ffffff78;
                border-radius: 0px;
            }
            .char-span {
                display: flex; 
                align-items: center; 
                justify-content: center; 
                flex: 1;
            }
            .alias-list {
                display: flex; 
                flex-direction: column;
            }
            .alias-span {
                text-align: center; 
                border-top: 1px solid #ffffff78; 
                padding: 2px 3px 2px 3px;
            }
        `;
	}
	static get properties(){
		return {
			title: { type: String },
			charAliasMap: { type: Array }
		}
	}
	constructor(){
		super();
		this.title = "";
		this.charAliasMap = [];
    }
    _charEntryTemplate(entry){
        return html`
            <div class="char-entry">
                <span class="char-span" style="font-family: KaTeX_${entry.fontFamily}">
                    ${entry.char}
                </span>
                
                <div class="alias-list">
                    ${entry.alias.slice(0, 1).map(ali => html`
                        <span class="alias-span">
                            ${ali}
                        </span>
                    `)}	
                </div>
            </div>
        `;
    }
	render(){
		return html`
			<h3>${this.title}</h3>
			<div class="char-table">
				${ this.charAliasMap.map(this._charEntryTemplate.bind(this)) }
			</div>
		`;
	}
}
customElements.define("char-table-element", CharTableElement);
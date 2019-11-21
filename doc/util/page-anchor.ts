import { html, TemplateResult } from 'lit-html';

export const pageAnchor = (id: string, template: TemplateResult) : TemplateResult => html`
    <div class="page-anchor" id="${id}">${template}</div>
`;
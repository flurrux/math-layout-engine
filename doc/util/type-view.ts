import { html, TemplateResult } from "lit-html";
import { markdownCode } from "./lit-marked";

const typeEl = (types: string, label: string) => html`
    <div style="margin: 0px 6px 0px 6px; max-width: 100%;">
        <div style="">${label}</div>
        ${markdownCode(types, "typescript")}
    </div>
`;

export const typeView = (formulaTypes: string, boxTypes: string) : TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap;">
        ${typeEl(formulaTypes, "formula")}
        ${typeEl(boxTypes, "box")}
    </div>
`;
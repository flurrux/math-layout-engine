import { html } from 'lit-html';
import './markdown-element';
import normalizeIndentation from './normalize-indentation';

export const markdown = (markdownStr: string) => html`
    <markdown-element .markdownString=${normalizeIndentation(markdownStr)}></markdown-element>
`;

export const markdownCode = (codeStr: string, language: string, fontSize: string = "1.3em") => html`
    <markdown-element style="
        font-size: ${fontSize};
    " 
    .markdownString=${`\`\`\`${language}
${normalizeIndentation(codeStr)}
\`\`\``}></markdown-element>
`;



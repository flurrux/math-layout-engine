/*
const template = `
\`\`\`javascript
{
	type: "mathlist",
	items: [
		{ type: "ord", value: "a" },
		{ type: "bin", value: "*" },
		{ type: "open", value: "(" },
		{ type: "ord", value: "b" },
		{ type: "bin", value: "+" },
		{ type: "ord", value: "c" },
		{ type: "open", value: ")" }
	]
}
\`\`\`

\`\`\`javascript
{
	type: "mathlist",
	dimensions: { ... },
	items: [
		{
			type: "char",
			char: "a",
			style: { ... },
			dimensions: { ... },
			position: [0, 0]
		},
		...
	]
}
\`\`\`
`;
*/

import '../labeled-arrow';
import rendering from './rendering.png';

export default `
<div class="formula-to-rendering">
	<pre><code class="language-javascript" style="
		font-size: 16px;
	">{
		<span class="hljs-attr">type</span>: <span class="hljs-string">"mathlist"</span>,
		<span class="hljs-attr">items</span>: [
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"a"</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"*"</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"open"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"("</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"b"</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"+"</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">"c"</span> },
			{ <span class="hljs-attr">type</span>: <span class="hljs-string">"open"</span>, <span class="hljs-attr">value</span>: <span class="hljs-string">")"</span> }
		]
	}</code></pre>
	<labeled-arrow label="layout"></labeled-arrow>
	<pre><code class="language-javascript" style="
		font-size: 16px;
	">{
		<span class="hljs-attr">type</span>: <span class="hljs-string">"mathlist"</span>,
		<span class="hljs-attr">dimensions</span>: { ... },
		<span class="hljs-attr">items</span>: [
			{
				<span class="hljs-attr">type</span>: <span class="hljs-string">"char"</span>,
				<span class="hljs-attr">char</span>: <span class="hljs-string">"a"</span>,
				<span class="hljs-attr">style</span>: { ... },
				<span class="hljs-attr">dimensions</span>: { ... },
				<span class="hljs-attr">position</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>]
			},
			...
		]
	}</code></pre>
	<labeled-arrow label="render"></labeled-arrow>
	<img src="${rendering}" />
</div>

`;
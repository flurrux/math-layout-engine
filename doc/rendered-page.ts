export default `
<h2 id="description">description</h2>
<p>this engine turns an abstract formula-description into a layout-description,
that can be rendered to canvas.</p>
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
    <img src="/rendering.843e1e2f.png">
</div>



<p>you can play around in the live-editor here:<br><a href="https://tender-brattain-a839fc.netlify.com/">https://tender-brattain-a839fc.netlify.com/</a></p>
<p>this documentation uses <a href="https://www.typescriptlang.org/docs/handbook/basic-types.html">typescript</a> to describe the structure of data.  </p>
<h2 id="disclaimer--credits">disclaimer &amp; credits</h2>
<p>some layout-algorithms and principles were taken from
<a href="http://www.ctex.org/documents/shredder/src/texbook.pdf">the texbook</a> (mainly <a href="https://github.com/flurrux/math-layout-engine/blob/master/dev/tex/texbook-generating-boxes.pdf">pages 440 to 447</a>),<br>other parts i have simply guessed and gone with my gut-feeling.<br>i have marked the sections in this documentation where the code<br>is close to tex and other parts that i made up myself.  </p>
<p>the part that i have neglected the most is probably (horizontal) kerning,<br>because i don't understand it very well.  </p>
<p>for fonts and references i have used katex.<br>their <a href="https://katex.org/#demo">live editor</a> is really good to see what things should look like.<br>links to <a href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/">fonts</a> and <a href="https://github.com/KaTeX/katex-fonts/blob/b4477ffc58391153f8e54231cab4746b9edc349d/fontMetricsData.js">metrics</a>.  </p>
<p>other font-data like bounding-boxes and glyph-contours are accessed with <a href="https://opentype.js.org/">opentype.js</a>.  </p>
<h2 id="installation">installation</h2>
<p>todo</p>
<h2 id="quick-example">quick example</h2>
<hr>
<pre><code class="language-javascript"><span class="hljs-keyword">import</span> {
    layoutFormula,
    centerNodeOnCanvas, renderFormulaLayout, loadKatexFontFaces
} <span class="hljs-keyword">from</span> <span class="hljs-string">'math-layout'</span>;

<span class="hljs-comment">//1 + 2 + 3 + ⋯ = -1/12</span>
<span class="hljs-keyword">const</span> formula = {
    <span class="hljs-string">"type"</span>: <span class="hljs-string">"mathlist"</span>,
    <span class="hljs-string">"items"</span>: [
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"1"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"+"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"2"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"+"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"3"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"+"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"⋯"</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"rel"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"="</span> },
        { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"-"</span> },
        {
            <span class="hljs-string">"type"</span>: <span class="hljs-string">"fraction"</span>,
            <span class="hljs-string">"numerator"</span>: { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"1"</span> },
            <span class="hljs-string">"denominator"</span>: { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"text"</span>: <span class="hljs-string">"12"</span> }
        }
    ]
};
<span class="hljs-keyword">const</span> layoutedFormula = layoutFormula(formula);

<span class="hljs-comment">//render the formula</span>
<span class="hljs-built_in">document</span>.body.insertAdjacentHTML(<span class="hljs-string">"beforeend"</span>, <span class="hljs-string">\`
	& lt; canvas id = "math-canvas" width = 800 height = 400 & gt;& lt; /canvas&gt;
\`</span>);
<span class="hljs-keyword">const</span> canvas = <span class="hljs-built_in">document</span>.querySelector(<span class="hljs-string">"#math-canvas"</span>);
<span class="hljs-keyword">const</span> ctx = canvas.getContext(<span class="hljs-string">"2d"</span>);
<span class="hljs-comment">//loading the fonts is asynchronous</span>
loadKatexFontFaces().then(
    <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> renderFormulaLayout(canvas, ctx, centerNodeOnCanvas(canvas, layoutedFormula))
);
</code></pre>
<p>the render should look like</p>
<p><img src="/quick-example-render.08a0bc87.png" alt="render result"></p>
<h2 id="formulanode">FormulaNode</h2>
<hr>
<pre><code class="language-typescript"><span class="hljs-keyword">interface</span> FormulaNode {
    <span class="hljs-keyword">type</span>: <span class="hljs-string">"ord"</span> | <span class="hljs-string">"op"</span> | <span class="hljs-string">"bin"</span> | <span class="hljs-string">"rel"</span> | <span class="hljs-string">"open"</span> | <span class="hljs-string">"close"</span> | <span class="hljs-string">"punct"</span> 
        | <span class="hljs-string">"mathlist"</span> | <span class="hljs-string">"fraction"</span> | <span class="hljs-string">"root"</span> | <span class="hljs-string">"script"</span> | <span class="hljs-string">"delimited"</span> | <span class="hljs-string">"accented"</span> | <span class="hljs-string">"matrix"</span>,  

    style?: Style
}</code></pre>
<p>the node-types fall into two categories:<br>char/text: ord, op, bin, rel, open, close, punct<br>composite: mathlist, fraction, root, script, delimited, accented  </p>
<p>they are detailed further below.  </p>
<p>nodes may or may not have an explicit style.<br>styles can be used to control font-family, font-size and emphasis (italic, bold).<br>usually you supply the topmost node with a style and the algorithms passes that style<br>down to child-nodes and adjusts it appropriately (e.g a superscript node gets a style with type "S" or "SS").<br>if you don't specify a style for the topmost node, a default style is used:  </p>
<pre><code class="language-typescript"><span class="hljs-keyword">const</span> defaultStyle : Style = {
    <span class="hljs-keyword">type</span>: <span class="hljs-string">"D"</span>, 
    fontSize: <span class="hljs-number">40</span>
}</code></pre>
<p>see <a href="#style">Style</a> for more information.  </p>
<h2 id="style">Style</h2>
<hr>
<pre><code class="language-typescript"><span class="hljs-keyword">interface</span> Style {
    <span class="hljs-keyword">type</span>?: <span class="hljs-string">"D"</span> | <span class="hljs-string">"T"</span> | <span class="hljs-string">"S"</span> | <span class="hljs-string">"SS"</span>,
    fontSize?: <span class="hljs-built_in">number</span>,
    emphasis?: <span class="hljs-string">"Regular"</span> | <span class="hljs-string">"Bold"</span> | <span class="hljs-string">"Italic"</span> | <span class="hljs-string">"BoldItalic"</span>,

    fontFamily?: <span class="hljs-string">"Math"</span>| <span class="hljs-string">"Main"</span> |
        <span class="hljs-string">"Size1"</span> | <span class="hljs-string">"Size2"</span> | <span class="hljs-string">"Size3"</span> | <span class="hljs-string">"Size4"</span> |
        <span class="hljs-string">"SansSerif"</span> | <span class="hljs-string">"Caligraphic"</span> | <span class="hljs-string">"AMS"</span> | <span class="hljs-string">"Fraktur"</span> | <span class="hljs-string">"Typewriter"</span> | <span class="hljs-string">"Script"</span>,

    cramped?: <span class="hljs-built_in">boolean</span>
}</code></pre>
<h3 id="type">type</h3>
<p>(as in tex)</p>
<h4 id="d-display">D (display)</h4>
<p><img src="/display.5e10c85d.png" alt="demo img">  </p>
<ul>
<li>numerators and denominators are further apart (than in text-style)  </li>
<li>superscripts are raised higher  </li>
<li>big operators are bigger and sub- and superscripts are placed below and above  </li>
</ul>
<h4 id="t-text-or-inline">T (text or inline)</h4>
<p><img src="/inline.85a5ec2a.png" alt="demo img"><br>this style takes up less vertical space than display-style.  </p>
<h4 id="s-script">S (script)</h4>
<p><img src="/script.a6881039.png" alt="demo img">  </p>
<ul>
<li>fontSize is reduced to 0.7 multiplied by the "base"-fontSize</li>
<li>no spacing between items in mathlist</li>
</ul>
<h4 id="ss-script-of-script">SS (script of script)</h4>
<p><img src="/script-of-script.fa8946be.png" alt="demo img">  </p>
<ul>
<li>fontSize is reduced to 0.5 multiplied by the "base"-fontSize  </li>
</ul>
<p>the "base"-fontSize depends on the type and fontSize of a node.<br>if there are two nested script-nodes like x^(2^2), then the superscript at the end<br>is scaled by 0.5 relative to the x-node, <strong>not</strong> by 0.7 × 0.5!  </p>
<h3 id="emphasis">emphasis</h3>
<p>emphasis describes one of 4 possible combinations of regular/bold and italic/normal.<br>some fonts don't support every combination.  </p>
<h3 id="cramped">cramped</h3>
<p>the cramped boolean means that a node should take up less vertical space,<br>so superscripts are raised less (and that's it?).<br>nodes that are placed under lines like denominators have a cramped-style.  </p>
<div style="
        display: grid; grid-template-columns: min-content min-content; 
        grid-column-gap: 14px; justify-items: center; align-items: end;
    ">
    <div>cramped</div>
    <div>uncramped</div>
    <img src="/cramped.a76e32cc.png">
    <img src="/uncramped.9a2206f6.png">
</div>






<h2 id="fonts">Fonts</h2>
<hr>
<h2 id="boxnode">BoxNode</h2>
<hr>
<h2 id="charnode">CharNode</h2>
<hr>
<p>types: ord, bin, rel, open, close, ...<br>these types are basically only used for horizontal spacing.<br>todo: available symbols
todo: aliases</p>
<h2 id="textnode">TextNode</h2>
<hr>
<h2 id="mathlist">MathList</h2>
<hr>
<pre><code class="language-typescript"><span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> MathListNode <span class="hljs-keyword">extends</span> FormulaNode {
    items: FormulaNode[]
}</code></pre>
<p>after layout:</p>
<pre><code class="language-typescript"><span class="hljs-keyword">export</span> <span class="hljs-keyword">interface</span> BoxMathListNode <span class="hljs-keyword">extends</span> BoxNode {
    items: BoxNode[]
}</code></pre>
<h3 id="example">example</h3>
<pre><code class="language-javascript">{
  <span class="hljs-string">"type"</span>: <span class="hljs-string">"mathlist"</span>,
  <span class="hljs-string">"items"</span>: [
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"-"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"x"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"*"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"open"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"("</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"1"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"+"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"x"</span> },
    { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">")"</span> }
  ]
}</code></pre>
<p><img src="/mathlist-demo.614097d0.png" alt="mathlist rendered"></p>
<h2 id="fraction">Fraction</h2>
<hr>
<pre><code class="language-typescript"><span class="hljs-keyword">interface</span> FractionNode <span class="hljs-keyword">extends</span> FormulaNode {
    <span class="hljs-keyword">type</span>: <span class="hljs-string">"fraction"</span>,
    numerator: FormulaNode,
    denominator: FormulaNode
}</code></pre>
<p>after layout:</p>
<pre><code class="language-typescript"><span class="hljs-keyword">interface</span> BoxFractionNode <span class="hljs-keyword">extends</span> BoxNode {
    <span class="hljs-keyword">type</span>: <span class="hljs-string">"fraction"</span>,
    numerator: BoxNode,
    denominator: BoxNode,
    rule: RuleNode
}
<span class="hljs-keyword">interface</span> RuleNode <span class="hljs-keyword">extends</span> BoxNode { 
    <span class="hljs-keyword">type</span>: <span class="hljs-string">"rule"</span> 
}</code></pre>
<p>the horizontal division-line in a fraction is called a rule and<br>its width spans the entire BoxFractionNode.<br>the line itself is centered vertically.  </p>
<h3 id="example-1">example</h3>
<pre><code class="language-javascript">{
  <span class="hljs-string">"type"</span>: <span class="hljs-string">"fraction"</span>,
  <span class="hljs-string">"numerator"</span>: {
    <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"μ"</span>
  },
  <span class="hljs-string">"denominator"</span>: {
    <span class="hljs-string">"type"</span>: <span class="hljs-string">"mathlist"</span>,
    <span class="hljs-string">"items"</span>: [
      { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"1"</span> },
      { <span class="hljs-string">"type"</span>: <span class="hljs-string">"bin"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"+"</span> },
      {
        <span class="hljs-string">"type"</span>: <span class="hljs-string">"fraction"</span>,
        <span class="hljs-string">"numerator"</span>: { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"μ"</span> },
        <span class="hljs-string">"denominator"</span>: { <span class="hljs-string">"type"</span>: <span class="hljs-string">"ord"</span>, <span class="hljs-string">"value"</span>: <span class="hljs-string">"beta"</span> }
      }
    ]
  }
}</code></pre>
<p><img src="/fraction-demo.31cd5072.png" alt="fraction demo"></p>
<h2 id="script">Script</h2>
<hr>
<h2 id="root">Root</h2>
<hr>
<h2 id="delimiter">Delimiter</h2>
<hr>
<h2 id="accent">Accent</h2>
<hr>
<h2 id="matrix">Matrix</h2>
<hr>

`;
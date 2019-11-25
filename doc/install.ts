
import { html } from 'lit-html';
import { markdown } from './util/lit-marked';
import { pageAnchor } from './util/page-anchor';

export default pageAnchor("installation", html`
${markdown(`
    ## installation
    ----------------

    this is a node-package, so run 
    \`\`\`bash
    npm install @flurrux/math-layout-engine
    \`\`\`
    or add the following to your dependencies in package.json
    \`\`\`javascript
    "@flurrux/math-layout-engine"
    \`\`\`
`)}
`);
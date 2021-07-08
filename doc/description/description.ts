
import { html } from 'lit-html';
import { markdown } from '../util/lit-marked';
import { pageAnchor } from '../util/page-anchor';
import './formula-to-rendering';


export default pageAnchor("description", html`

${markdown(`
    ## description

    this engine turns an abstract formula-description into a layout-description,
    that can be rendered to canvas.
`)}

<formula-to-rendering-example></formula-to-rendering-example>

${markdown(`
    you can play around in the live-editor here:  
    <https://flurrux-math-layout-live.netlify.app/>

    this documentation uses [typescript](https://www.typescriptlang.org/docs/handbook/basic-types.html) to describe the structure of data.  
`)}

`);


import { markdownStr } from './doc-text';
import { render } from 'lit-html';
import { loadKatexFontFaces } from '../src/rendering/render';

loadKatexFontFaces();
render(markdownStr, document.querySelector("#page"));


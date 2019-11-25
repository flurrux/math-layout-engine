

import { markdownStr } from './doc-text';
import { render } from 'lit-html';
import { loadKatexFontFaces } from '../src/index';

loadKatexFontFaces();
render(markdownStr, document.querySelector("#page"));


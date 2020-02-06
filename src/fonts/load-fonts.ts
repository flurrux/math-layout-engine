import fonts from './*.ttf';
import { addFontFaces } from '../util/util';

export const loadFontFaces = () => addFontFaces(fonts);
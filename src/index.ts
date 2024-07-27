import { layout } from './layout/layout';
import { parse } from './parsing/parser';
import { renderBoxNode } from './rendering/render-box-node';
import { renderFormulaLayout } from './rendering/render-formula';
import { centerBoxNodeOnCanvas } from './rendering/centering';
import { loadKatexFontFacesFromCDN } from './font-data/load-fonts-from-cdn';

export default {
	layout: { layoutFormula: layout },
	parsing: { parseFormula: parse }, 
	rendering: {
		centerNodeOnCanvas: centerBoxNodeOnCanvas,
		renderFormulaLayout,
		renderBoxNode
	},
	fonts: { loadKatexFontFacesFromCDN }
}
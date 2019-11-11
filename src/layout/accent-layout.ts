import { layoutWithStyle } from "./layout";
import { center, setPosition, calcBoundingDimensions } from './layout-util';
import { isNodeChar } from "../node-types";
import { getMetricsObject, Metrics } from "../font-data/katex-font-util";

import { FormulaNode, BoxNode, CharNode } from '../types';
import { Style } from '../style';
import { BoxCharNode } from './char-layout';
interface FormulaAccentNode extends FormulaNode {
    nucleus: FormulaNode,
    accent: CharNode
};

interface BoxAccentNode extends BoxNode {
    nucleus: BoxNode,
    accent: BoxCharNode
};

const getAccentWidthAndOffset = (style: Style, nucleusMetrics: Metrics, accent: CharNode, accentLayouted: BoxCharNode) => {
    let accentWidth = accentLayouted.dimensions.width;
    let offsetX = isNodeChar(accent) ? style.fontSize * nucleusMetrics.skew : 0;
    
    //vector
    if (accentLayouted.unicode === 8407){
        accentWidth = 0.471 * style.fontSize;
        offsetX += accentWidth;
    }

    return {
        accentWidth, accentOffsetX: offsetX
    };
};

const getAccentPlacementData = (style: Style, nucleus: FormulaNode, nucleusLayouted: BoxNode, accent: CharNode, accentLayouted: BoxCharNode) : { accentWidth: number, accentOffsetX: number, nucleusWidth: number } => {
    if (isNodeChar(nucleus)){
        const nucleusStyle = nucleusLayouted.style;
        const nucleusUnicode = (nucleusLayouted as BoxCharNode).unicode;
        const nucleusMetrics = getMetricsObject(nucleusStyle.fontFamily, nucleusStyle.emphasis, nucleusUnicode);
        const nucleusWidth = nucleusLayouted.dimensions.width + nucleusMetrics.italicCorrection;
        
        const { accentWidth, accentOffsetX } = getAccentWidthAndOffset(style, nucleusMetrics, accent, accentLayouted);
        return { nucleusWidth, accentWidth, accentOffsetX };
    }
    return {
        nucleusWidth: nucleusLayouted.dimensions.width,
        accentWidth: accentLayouted.dimensions.width,
        accentOffsetX: 0
    };
};

export const layoutAccent = (node: FormulaAccentNode) : BoxAccentNode => {
    const { nucleus, accent, style } = node;

    const fontSize = style.fontSize;
    const nucleusLayouted = layoutWithStyle(style)(nucleus);
    const accentLayouted = layoutWithStyle(style)(accent) as BoxCharNode;

    const accentPlacementData = getAccentPlacementData(style, nucleus, nucleusLayouted, accent, accentLayouted);  

    const accentX = center(accentPlacementData.accentWidth, accentPlacementData.nucleusWidth) + accentPlacementData.accentOffsetX;
    const verticalSpacing = 0.1 * fontSize;
    const accentY = nucleusLayouted.dimensions.yMax - accentLayouted.bbox.yMin + verticalSpacing;

    const horizontalShift = Math.max(0, -accentX);
    const nucleusPositioned: BoxNode = setPosition([horizontalShift, 0])(nucleusLayouted);
    const accentPositioned: BoxCharNode = setPosition<BoxCharNode>([accentX, accentY])(accentLayouted);

    if (accentLayouted.unicode === 8407){
        accentLayouted.dimensions.width -= accentPlacementData.accentOffsetX;
    }

    const dimensions = calcBoundingDimensions([nucleusPositioned, accentPositioned]);
    return {
        type: "accented",
        style, dimensions,
        nucleus: nucleusPositioned, 
        accent: accentPositioned,
    }
};
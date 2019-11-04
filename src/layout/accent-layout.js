import { layoutWithStyle } from "./layout";
import { center, setPosition, calcBoundingDimensions } from './layout-util';
import { isNodeChar } from "../node-types";
import { getMetricsObject } from "../font-data/katex-font-util";

/*
    node: {
        nucleus: node,
        accent: node
    }
*/

const getAccentWidthAndOffset = (style, nucleusMetrics, accent, accentLayouted) => {
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

const widthOfBbox = bbox => bbox.xMax - bbox.xMin;
export const layoutAccent = (node) => {
    const { nucleus, accent, style } = node;

    const fontSize = style.fontSize;
    const [nucleusLayouted, accentLayouted] = [nucleus, accent].map(layoutWithStyle(style));
    const nucleusStyle = nucleusLayouted.style;
    const nucleusMetrics = getMetricsObject(nucleusStyle.fontFamily, nucleusStyle.emphasis, nucleusLayouted.unicode);
    const nucleusWidth = nucleusLayouted.dimensions.width + nucleusMetrics.italicCorrection;
    
    const { accentWidth, accentOffsetX } = getAccentWidthAndOffset(style, nucleusMetrics, accent, accentLayouted);

    const accentX = center(accentWidth, nucleusWidth) + accentOffsetX;
    const verticalSpacing = 0.1 * fontSize;
    const accentY = nucleusLayouted.dimensions.yMax - accentLayouted.bbox.yMin + verticalSpacing;

    const horizontalShift = Math.max(0, -accentX);
    const nucleusPositioned = setPosition([horizontalShift, 0])(nucleusLayouted);
    const accentPositioned = setPosition([accentX, accentY])(accentLayouted);

    const dimensions = calcBoundingDimensions([nucleusPositioned, accentPositioned]);
    return {
        type: "accented",
        style, dimensions,
        nucleus: nucleusPositioned, 
        accent: accentPositioned,
    }
};
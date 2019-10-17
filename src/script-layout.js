
const fontFamilyToTargetY = {
    Math: { supY: 0.42, subY: -0.2 }, 
    Size2: { supY: 0.7, subY: -0.4 }
};
const targetYOverride = [
    { fontFamily: "Size2", unicode: 8747, supY: 1.15, subY: -0.85 }
];
const getOverridenTargetY = (fontFamily, unicode) => targetYOverride.find(entry => entry.fontFamily === fontFamily && entry.unicode === unicode);
export const getTargetYOfGlyphNucleus = (fontFamily, unicode) => getOverridenTargetY(fontFamily, unicode) || fontFamilyToTargetY[fontFamily]

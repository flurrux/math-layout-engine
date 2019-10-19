

import fontMetrics from './font-metrics-data.js';
const capitalize = (str) => str.substr(0, 1).toUpperCase() + str.substr(1);

const getMetricsByFont = (fontFamily, emphasis) => fontMetrics[`${fontFamily}-${emphasis}`];
export const getMetrics = (fontFamily, emphasis, unicode) => getMetricsByFont(fontFamily, emphasis)[unicode];
export const objectifyMetrics = metric => {
    return {
        depth: metric[0],
        height: metric[1],
        italicCorrection: metric[2],
        skew: metric[3],
        width: metric[4]
    }
};
export const getMetricsObject = (fontFamily, emphasis, unicode) => objectifyMetric(getMetrics(fontFamily, emphasis, unicode));

const katexFontFamily = {
    AMS: "AMS", 
    Caligraphic: "Caligraphic",
    Fraktur: "Fraktur",
    Main: "Main",
    Math: "Math",
    SansSerif: "SansSerif",
    Script: "Script",
    Size1: "Size1",
    Size2: "Size2",
    Size3: "Size3",
    Size4: "Size4",
    Typewriter: "Typewriter"
};

export const fontData = [
    { name: "AMS", emphasis: ["Regular"] },
    { name: "Caligraphic", emphasis: ["Regular", "Bold"] },
    { name: "Fraktur", emphasis: ["Regular", "Bold"] },
    { name: "Main", emphasis: ["Regular", "Bold", "Italic", "BoldItalic"] },
    { name: "Math", emphasis: ["Italic", "BoldItalic"] },
    { name: "SansSerif", emphasis: ["Regular", "Bold", "Italic"] },
    { name: "Script", emphasis: ["Regular"] },
    { name: "Size1", emphasis: ["Regular"] },
    { name: "Size2", emphasis: ["Regular"] },
    { name: "Size3", emphasis: ["Regular"] },
    { name: "Size4", emphasis: ["Regular"] },
    { name: "Typewriter", emphasis: ["Regular"] }
];
export const getFontDataByName = (name) => fontData.find(entry => entry.name === name);
export const getDefaultEmphasis = fontFamily => getFontDataByName(fontFamily).emphasis[0];
export const fontIdentifiers = fontData.map(entry => entry.emphasis.map(emph => `${entry.name}-${emph}`)).flat();

const fontFamilyLookUpOrder = [
    "Math", "Main", 
    "Size1", "Size2", "Size3", "Size4",
    "SansSerif", "Caligraphic", "AMS", "Fraktur", "Typewriter", "Script"
];

const hasFontFamilyUnicode = (fontFamily, emphasis, unicode) => getMetrics(fontFamily, emphasis, unicode) !== undefined;

const lookUpFamilyNameByUnicode = (unicode) => {
    for (const fontFam of fontFamilyLookUpOrder){
        const fontEntry = getFontDataByName(fontFam);
        for (const emph of fontEntry.emphasis){
            if (hasFontFamilyUnicode(fontFam, emph, unicode)){
                return { fontFamily: fontFam, emphasis: emph };
            }
        }
    }
};



const aliasMap = [
    { alias: ["plus", "+"], fontFamily: "Main", unicode: 43 },
    { alias: ["minus", "-"], fontFamily: "Main", unicode: 8722 },
    { alias: ["muldot"], fontFamily: "Math", unicode: 8901 },
    { alias: ["equal", "="], fontFamily: "Main", unicode: 61 },

    { alias: ["integral"], fontFamily: "Size2", unicode: 8747 },
    { alias: ["sum"], fontFamily: "Size2", unicode: 8721 },
    { alias: ["product"], fontFamily: "Size2", unicode: 8719 },

    { alias: ["infinity"], fontFamily: "Main", unicode: 8734 },

    { alias: ["a"], fontFamily: "Math", unicode: 97 },
    { alias: ["b"], fontFamily: "Math", unicode: 98 }, 
    { alias: ["c"], fontFamily: "Math", unicode: 99 }, 
    { alias: ["d"], fontFamily: "Math", unicode: 100 }, 
    { alias: ["e"], fontFamily: "Math", unicode: 101 }, 
    { alias: ["f"], fontFamily: "Math", unicode: 102 }, 
    { alias: ["g"], fontFamily: "Math", unicode: 103 }, 
    { alias: ["h"], fontFamily: "Math", unicode: 104 }, 
    { alias: ["i"], fontFamily: "Math", unicode: 105 }, 
    { alias: ["j"], fontFamily: "Math", unicode: 106 }, 
    { alias: ["k"], fontFamily: "Math", unicode: 107 }, 
    { alias: ["l"], fontFamily: "Math", unicode: 108 }, 
    { alias: ["m"], fontFamily: "Math", unicode: 109 }, 
    { alias: ["n"], fontFamily: "Math", unicode: 110 }, 
    { alias: ["o"], fontFamily: "Math", unicode: 111 }, 
    { alias: ["p"], fontFamily: "Math", unicode: 112 }, 
    { alias: ["q"], fontFamily: "Math", unicode: 113 }, 
    { alias: ["r"], fontFamily: "Math", unicode: 114 }, 
    { alias: ["s"], fontFamily: "Math", unicode: 115 }, 
    { alias: ["t"], fontFamily: "Math", unicode: 116 }, 
    { alias: ["u"], fontFamily: "Math", unicode: 117 }, 
    { alias: ["v"], fontFamily: "Math", unicode: 118 }, 
    { alias: ["w"], fontFamily: "Math", unicode: 119 }, 
    { alias: ["x"], fontFamily: "Math", unicode: 120 }, 
    { alias: ["y"], fontFamily: "Math", unicode: 121 }, 
    { alias: ["z"], fontFamily: "Math", unicode: 122 }, 


    { alias: ["ellipsis", "..."], fontFamily: "Math", unicode: 8943 },

    { alias: ["alpha"], fontFamily: "Math", unicode: 945 },
    { alias: ["beta"], fontFamily: "Math", unicode: 946 },
    { alias: ["gamma"], fontFamily: "Math", unicode: 947 },
    { alias: ["delta"], fontFamily: "Math", unicode: 948 },

    { alias: ["natural-numbers"], fontFamily: "AMS", unicode: 78 },
    { alias: ["integers"], fontFamily: "AMS", unicode: 90 },
    { alias: ["rational-numbers"], fontFamily: "AMS", unicode: 81 },
    { alias: ["real-numbers"], fontFamily: "AMS", unicode: 82 },
    { alias: ["complex-numbers"], fontFamily: "AMS", unicode: 67 },
];
const lookUpAliasEntry = alias => aliasMap.find(entry => entry.alias.includes(alias));

import { pick } from 'ramda';
export const lookUpGlyphByCharOrAlias = (charOrAlias) => {
    const aliasEntry = lookUpAliasEntry(charOrAlias);
    if (aliasEntry){
        return pick(["fontFamily", "unicode"], aliasEntry);
    }

    //no alias found, treat the argument as a char
    const unicode = charOrAlias.charCodeAt(0);
    const { fontFamily, emphasis } = lookUpFamilyNameByUnicode(unicode);
    return {
        fontFamily, unicode
    };
};

import bboxData from './font-bbox-data.js';
export const lookUpBoundingBox = (fontFamily, unicode, emphasis=null) => {
	emphasis = emphasis || getDefaultEmphasis(fontFamily);
	return bboxData[`${fontFamily}-${emphasis}`][unicode];
};


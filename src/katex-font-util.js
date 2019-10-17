

import fontMetrics from './fontMetricsData.js';
const capitalize = (str) => str.substr(0, 1).toUpperCase() + str.substr(1);
const getMetricsByFont = (fontFamily, emphasis) => fontMetrics[`${fontFamily}-${capitalize(emphasis)}`];
const getMetrics = (fontFamily, emphasis, unicode) => getMetricsByFont(fontFamily, emphasis)[unicode];
const objectifyMetrics = metric => {
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
    { name: "AMS", emphasis: ["regular"] },
    { name: "Caligraphic", emphasis: ["regular", "bold"] },
    { name: "Fraktur", emphasis: ["regular", "bold"] },
    { name: "Main", emphasis: ["regular", "bold", "italic", "bolditalic"] },
    { name: "Math", emphasis: ["italic", "bolditalic"] },
    { name: "SansSerif", emphasis: ["regular", "bold", "italic"] },
    { name: "Script", emphasis: ["regular"] },
    { name: "Size1", emphasis: ["regular"] },
    { name: "Size2", emphasis: ["regular"] },
    { name: "Size3", emphasis: ["regular"] },
    { name: "Size4", emphasis: ["regular"] },
    { name: "Typewriter", emphasis: ["regular"] }
];
export const getFontDataByName = (name) => fontData.find(entry => entry.name === name);

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
            if (hasFontFamilyUnicode(fontFam, emph), unicode){
                return { fontFamily: fontFam, emphasis: emph };
            }
        }
    }
};



const aliasMap = [
    {
        alias: ["plus", "+"],
        fontFamily: "Main", unicode: 43
    },
    {
        alias: ["minus", "-"],
        fontFamily: "Main", unicode: 8722
    },
    {
        alias: ["muldot"], 
        fontFamily: "Math", unicode: 8901
    },

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


    {
        alias: ["ellipsis", "..."],
        fontFamily: "Math", unicode: 8943
    },

    {
        alias: ["alpha"],
        fontFamily: "Math", unicode: 945
    },
    {
        alias: ["beta"],
        fontFamily: "Math", unicode: 946
    },
    {
        alias: ["gamma"],
        fontFamily: "Math", unicode: 947
    },
    {
        alias: ["delta"],
        fontFamily: "Math", unicode: 948
    },

    {
        alias: ["natural-numbers"],
        fontFamily: "AMS", unicode: 78
    },
    {
        alias: ["integers"],
        fontFamily: "AMS", unicode: 90
    },
    {
        alias: ["rational-numbers"],
        fontFamily: "AMS", unicode: 81
    },
    {
        alias: ["real-numbers"],
        fontFamily: "AMS", unicode: 82
    },
    {
        alias: ["complex-numbers"],
        fontFamily: "AMS", unicode: 67
    },
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
    const fontFamily = lookUpFamilyNameByUnicode(unicode);
    return {
        fontFamily, unicode
    };
};
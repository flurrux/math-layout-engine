
import { flatten } from 'ramda';

import fontMetrics from './font-metrics-data.js';

export interface Metrics {
    width: number,
    height: number, 
    depth: number, 
    italicCorrection: number,
    skew: number
};

const getMetricEntriesOfFont = (fontFamily: string, emphasis: string): { [key: string]: number[] } => fontMetrics[`${fontFamily}-${emphasis}`];
export const getMetrics = (fontFamily: string, emphasis: string, unicode: number): number[] => getMetricEntriesOfFont(fontFamily, emphasis)[unicode];
export const objectifyMetrics = (metric: number[]) : Metrics => {
    return {
        depth: metric[0],
        height: metric[1],
        italicCorrection: metric[2],
        skew: metric[3],
        width: metric[4]
    }
};
export const getMetricsObject = (fontFamily: string, emphasis: string, unicode: number): Metrics => objectifyMetrics(getMetrics(fontFamily, emphasis, unicode));

const katexFontFamily : { [key: string]: string } = {
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

export const fontData: { 
    name: string, emphasis: string[], styleWeightCombinations: [string, string][]
}[] = 
[
    { 
        name: "AMS", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Caligraphic", 
        emphasis: ["Regular", "Bold"], 
        styleWeightCombinations: [["normal", "normal"], ["normal", "bold"]]
    },
    { 
        name: "Fraktur", 
        emphasis: ["Regular", "Bold"],
        styleWeightCombinations: [["normal", "normal"], ["normal", "bold"]]
    },
    { 
        name: "Main", 
        emphasis: ["Regular", "Bold", "Italic", "BoldItalic"],
        styleWeightCombinations: [
            ["normal", "normal"], ["normal", "bold"], ["italic", "normal"], ["italic", "bold"]
        ]
    },
    { 
        name: "Math", 
        emphasis: ["Italic", "BoldItalic"],
        styleWeightCombinations: [["italic", "normal"], ["italic", "bold"]]
    },
    { 
        name: "SansSerif", 
        emphasis: ["Regular", "Bold", "Italic"],
        styleWeightCombinations: [["normal", "normal"], ["normal", "bold"], ["italic", "normal"]]
    },
    { 
        name: "Script", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Size1", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Size2", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Size3", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Size4", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    },
    { 
        name: "Typewriter", 
        emphasis: ["Regular"],
        styleWeightCombinations: [["normal", "normal"]]
    }
];
const styleWeightCombinationToNumber = (style: string, weight: string): number => (weight === "normal" ? 0 : 2) + (style === "normal" ? 0 : 1);
export const styleWeightCombinationToEmphasis = (style: string, weight: string): string => ["Regular", "Italic", "Bold", "BoldItalic"][styleWeightCombinationToNumber(style, weight)];
export const emphasisToStyleWeightCombination = (emphasis: string): string[] => {
    const index: number = ["Regular", "Italic", "Bold", "BoldItalic"].indexOf(emphasis);
    return [
        ["normal", "normal"],
        ["italic", "normal"],
        ["normal", "bold"],
        ["italic", "bold"]
    ][index];
};

export const getFontDataByName = (name: string) => fontData.find(entry => entry.name === name);
export const getDefaultEmphasis = (fontFamily: string): string => getFontDataByName(fontFamily).emphasis[0];
export const fontIdentifiers: string[] = flatten(fontData.map(entry => entry.emphasis.map(emph => `${entry.name}-${emph}`)));

const fontFamilyLookUpOrder = [
    "Math", "Main", 
    "Size1", "Size2", "Size3", "Size4",
    "SansSerif", "Caligraphic", "AMS", "Fraktur", "Typewriter", "Script"
];

export const hasFontFamilyUnicode = (fontFamily: string, emphasis: string, unicode: number) : boolean => getMetrics(fontFamily, emphasis, unicode) !== undefined;

const lookUpFamilyNameByUnicode = (unicode: number): { fontFamily: string, emphasis: string } => {
    for (const fontFam of fontFamilyLookUpOrder){
        const fontEntry = getFontDataByName(fontFam);
        for (const emph of fontEntry.emphasis){
            if (hasFontFamilyUnicode(fontFam, emph, unicode)){
                return { fontFamily: fontFam, emphasis: emph };
            }
        }
    }
};



const aliasMap : { alias: string[], fontFamily: string, unicode: number }[] = [
	//big operators
	{ alias: ["integral"], fontFamily: "Size2", unicode: 8747 },
	{ alias: ["sum"], fontFamily: "Size2", unicode: 8721 },
	{ alias: ["product"], fontFamily: "Size2", unicode: 8719 },
	
	//binary operators
	{ alias: ["+"], fontFamily: "Main", unicode: 43 },
    { alias: ["-"], fontFamily: "Main", unicode: 8722 },
    { alias: ["+-"], fontFamily: "Main", unicode: 177 },
    { alias: ["*"], fontFamily: "Main", unicode: 8901 },
	{ alias: ["division"], fontFamily: "Main", unicode: 247 },
	{ alias: ["cross"], fontFamily: "Main", unicode: 215 },
	{ alias: ["ring"], fontFamily: "Main", unicode: 8728 },

	//relation
	{ alias: ["equal", "="], fontFamily: "Main", unicode: 61 },
	{ alias: ["<="], fontFamily: "Main", unicode: 8804 },
	{ alias: [">="], fontFamily: "Main", unicode: 8805 },
	{ alias: ["<<"], fontFamily: "Main", unicode: 8810 },
	{ alias: [">>"], fontFamily: "Main", unicode: 8811 },
	{ alias: ["approx"], fontFamily: "Main", unicode: 8776 },
	{ alias: ["equiv"], fontFamily: "Main", unicode: 8801 },
	{ alias: ["not equal"], fontFamily: "Main", unicode: 57376 },

	{ alias: ["in"], fontFamily: "Main", unicode: 8712 },
	{ alias: ["owns"], fontFamily: "Main", unicode: 8715 },
	{ alias: ["subset"], fontFamily: "Main", unicode: 8835 },
	{ alias: ["subset equal"], fontFamily: "Main", unicode: 8839 },

	{ alias: ["not in"], fontFamily: "Main", unicode: 47 },

	//accents
    { alias: ["dotaccent"], fontFamily: "Main", unicode: 729 },
	{ alias: ["vector"], fontFamily: "Main", unicode: 8407 },

	//open & close
	{ unicode: 10216, fontFamily: "Main", alias: ["left angle"] },
	{ unicode: 10217, fontFamily: "Main", alias: ["right angle"] },
	{ unicode: 8968, fontFamily: "Main", alias: ["left ceil"] },
	{ unicode: 8969, fontFamily: "Main", alias: ["right ceil"] },
	{ unicode: 8970, fontFamily: "Main", alias: ["left floor"] },
	{ unicode: 8971, fontFamily: "Main", alias: ["right floor"] },

	//misc
	{ alias: ["implies"], fontFamily: "Main", unicode: 10233},
	{ alias: ["maps to"], fontFamily: "Main", unicode: 8614 },
	{ alias: ["to", "->"], fontFamily: "Main", unicode: 8594 },
	{ alias: ["'"], fontFamily: "Main", unicode: 8242 },
    { alias: ["infinity"], fontFamily: "Main", unicode: 8734 },
    { alias: ["dotdotdot", "..."], fontFamily: "Main", unicode: 8943 },
	{ alias: ["ellipsis", "..."], fontFamily: "Math", unicode: 8943 },


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

	//greek letters
    { alias: ["alpha"], fontFamily: "Math", unicode: 945 },
    { alias: ["beta"], fontFamily: "Math", unicode: 946 },
    { alias: ["gamma"], fontFamily: "Math", unicode: 947 },
    { alias: ["delta"], fontFamily: "Math", unicode: 948 },
    { alias: ["pi"], fontFamily: "Math", unicode: 960 },

	
    { alias: ["natural-numbers"], fontFamily: "AMS", unicode: 78 },
    { alias: ["integers"], fontFamily: "AMS", unicode: 90 },
    { alias: ["rational-numbers"], fontFamily: "AMS", unicode: 81 },
    { alias: ["real-numbers"], fontFamily: "AMS", unicode: 82 },
    { alias: ["complex-numbers"], fontFamily: "AMS", unicode: 67 },
];
const lookUpAliasEntry = (alias: string) => aliasMap.find(entry => entry.alias.includes(alias));

import { pick } from 'ramda';
export const lookUpGlyphByCharOrAlias = (charOrAlias: string) : { fontFamily: string, unicode: number} => {
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

export const lookUpUnicode = (charOrAlias: string) : number => lookUpGlyphByCharOrAlias(charOrAlias).unicode;

import bboxData from './font-bbox-data.js';
import { BoundingBox } from '../types';
export const lookUpBoundingBox = (fontFamily: string, unicode: number, emphasis: string = null) : BoundingBox => {
	emphasis = emphasis || getDefaultEmphasis(fontFamily);
    const bbox: number[] = bboxData[`${fontFamily}-${emphasis}`][unicode];
    return {
        xMin: bbox[0], yMin: bbox[1],
        xMax: bbox[2], yMax: bbox[3]
    }
};

export const getUrlByFontName = (fontFamily: string, emphasis: string = null) : string => {
	emphasis = emphasis || getDefaultEmphasis(fontFamily);
	return `https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${fontFamily}-${emphasis}.ttf`
};
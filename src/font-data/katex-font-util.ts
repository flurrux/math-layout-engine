
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

export const lookUpFamilyNameByUnicode = (unicode: number): { fontFamily: string, emphasis: string } => {
    for (const fontFam of fontFamilyLookUpOrder){
        const fontEntry = getFontDataByName(fontFam);
        for (const emph of fontEntry.emphasis){
            if (hasFontFamilyUnicode(fontFam, emph, unicode)){
                return { fontFamily: fontFam, emphasis: emph };
            }
        }
    }
};



export const aliasMap : { alias: string[], fontFamily: string, unicode: number }[] = [
	//big operators
	{ alias: ["integral"], fontFamily: "Size2", unicode: 8747 },
	{ alias: ["sum"], fontFamily: "Size2", unicode: 8721 },
	{ alias: ["product"], fontFamily: "Size2", unicode: 8719 },
    { alias: ["big-union"], fontFamily: "Size2", unicode: 8899 },
    
	//binary operators
	{ alias: ["+"], fontFamily: "Main", unicode: 43 },
    { alias: ["-"], fontFamily: "Main", unicode: 8722 },
    { alias: ["+-"], fontFamily: "Main", unicode: 177 },
    { alias: ["*"], fontFamily: "Main", unicode: 8901 },
    { alias: ["/"], fontFamily: "Main", unicode: 47 },
	{ alias: ["division"], fontFamily: "Main", unicode: 247 },
	{ alias: ["cross"], fontFamily: "Main", unicode: 215 },
	{ alias: ["ring"], fontFamily: "Main", unicode: 8728 },
    { alias: ["asterisk"], fontFamily: "Main", unicode: 42 },

	//relation
    { alias: ["equal", "="], fontFamily: "Main", unicode: 61 },
    { alias: ["smaller", "<"], fontFamily: "Main", unicode: 60 },
    { alias: ["greater", ">"], fontFamily: "Main", unicode: 62 },
	{ alias: ["<="], fontFamily: "Main", unicode: 8804 },
	{ alias: [">="], fontFamily: "Main", unicode: 8805 },
	{ alias: ["<<"], fontFamily: "Main", unicode: 8810 },
	{ alias: [">>"], fontFamily: "Main", unicode: 8811 },
	{ alias: ["approx"], fontFamily: "Main", unicode: 8776 },
	{ alias: ["equiv"], fontFamily: "Main", unicode: 8801 },

	{ alias: ["in"], fontFamily: "Main", unicode: 8712 },
	{ alias: ["owns"], fontFamily: "Main", unicode: 8715 },
	{ alias: ["subset"], fontFamily: "Main", unicode: 8834 },
	{ alias: ["subset-equal"], fontFamily: "Main", unicode: 8838 },

	//accents
    { alias: ["dot-accent"], fontFamily: "Main", unicode: 729 },
	{ alias: ["vector"], fontFamily: "Main", unicode: 8407 },
    { alias: ["bar"], fontFamily: "Main", unicode: 713 },
	{ alias: ["double-dot-accent"], fontFamily: "Main", unicode: 168 },
    { alias: ["ring-accent"], fontFamily: "Main", unicode: 730 },
    { alias: ["hat-accent"], fontFamily: "Main", unicode: 94 },

	//open & close
	{ alias: ["left-angle"], fontFamily: "Main", unicode: 10216 },
	{ alias: ["right-angle"], fontFamily: "Main", unicode: 10217 },
	{ alias: ["left-ceil"], fontFamily: "Main", unicode: 8968 },
	{ alias: ["right-ceil"], fontFamily: "Main", unicode: 8969 },
	{ alias: ["left-floor"], fontFamily: "Main", unicode: 8970 },
	{ alias: ["right-floor"], fontFamily: "Main", unicode: 8971 },
    { alias: ["{", "left-brace"], fontFamily: "Main", unicode: 123 },
    { alias: ["}", "right-brace"], fontFamily: "Main", unicode: 125 },

	//misc
	{ alias: ["implies"], fontFamily: "Main", unicode: 10233},
	{ alias: ["maps-to"], fontFamily: "Main", unicode: 8614 },
	{ alias: ["to", "->"], fontFamily: "Main", unicode: 8594 },
	{ alias: ["'"], fontFamily: "Main", unicode: 8242 },
    { alias: ["infinity"], fontFamily: "Main", unicode: 8734 },
    { alias: ["..."], fontFamily: "Main", unicode: 8943 },

    //alphabet
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
    { alias: ["Alpha"], fontFamily: "Main", unicode: 65 },
    { alias: ["Beta"], fontFamily: "Main", unicode: 66 },
    { alias: ["Gamma"], fontFamily: "Main", unicode: 915 },
    { alias: ["Delta"], fontFamily: "Main", unicode: 916 },
    { alias: ["Epsilon"], fontFamily: "Main", unicode: 69 },
    { alias: ["Zeta"], fontFamily: "Main", unicode: 90 },
    { alias: ["Eta"], fontFamily: "Main", unicode: 72 },
    { alias: ["Theta"], fontFamily: "Main", unicode: 920 },
    { alias: ["Iota"], fontFamily: "Main", unicode: 73 },
    { alias: ["Kappa"], fontFamily: "Main", unicode: 75 },
    { alias: ["Lambda"], fontFamily: "Main", unicode: 923 },
    { alias: ["Mu"], fontFamily: "Main", unicode: 77 },
    { alias: ["Nu"], fontFamily: "Main", unicode: 78 },
    { alias: ["Xi"], fontFamily: "Main", unicode: 926 },
    { alias: ["Omicron"], fontFamily: "Main", unicode: 79 },
    { alias: ["Pi"], fontFamily: "Main", unicode: 928 },
    { alias: ["Rho"], fontFamily: "Main", unicode: 80 },
    { alias: ["Sigma"], fontFamily: "Main", unicode: 931 },
    { alias: ["Tau"], fontFamily: "Main", unicode: 84 },
    { alias: ["Upsilon"], fontFamily: "Main", unicode: 933 },
    { alias: ["Phi"], fontFamily: "Main", unicode: 934 },
    { alias: ["Chi"], fontFamily: "Main", unicode: 88 },
    { alias: ["Psi"], fontFamily: "Main", unicode: 936 },
    { alias: ["Omega"], fontFamily: "Main", unicode: 937 },
    { alias: ["varGamma"], fontFamily: "Main", unicode: 915 },
    { alias: ["varDelta"], fontFamily: "Main", unicode: 916 },
    { alias: ["varTheta"], fontFamily: "Main", unicode: 920 },
    { alias: ["varLambda"], fontFamily: "Main", unicode: 923 },
    { alias: ["varXi"], fontFamily: "Main", unicode: 926 },
    { alias: ["varPi"], fontFamily: "Main", unicode: 928 },
    { alias: ["varSigma"], fontFamily: "Main", unicode: 931 },
    { alias: ["varUpsilon"], fontFamily: "Main", unicode: 933 },
    { alias: ["varPhi"], fontFamily: "Main", unicode: 934 },
    { alias: ["varPsi"], fontFamily: "Main", unicode: 936 },
    { alias: ["varOmega"], fontFamily: "Main", unicode: 937 },
    { alias: ["alpha"], fontFamily: "Math", unicode: 945 },
    { alias: ["beta"], fontFamily: "Math", unicode: 946 },
    { alias: ["gamma"], fontFamily: "Math", unicode: 947 },
    { alias: ["delta"], fontFamily: "Math", unicode: 948 },
    { alias: ["epsilon"], fontFamily: "Math", unicode: 1013 },
    { alias: ["zeta"], fontFamily: "Math", unicode: 950 },
    { alias: ["eta"], fontFamily: "Math", unicode: 951 },
    { alias: ["theta"], fontFamily: "Math", unicode: 952 },
    { alias: ["iota"], fontFamily: "Math", unicode: 953 },
    { alias: ["kappa"], fontFamily: "Math", unicode: 954 },
    { alias: ["lambda"], fontFamily: "Math", unicode: 955 },
    { alias: ["mu"], fontFamily: "Math", unicode: 956 },
    { alias: ["nu"], fontFamily: "Math", unicode: 957 },
    { alias: ["xi"], fontFamily: "Math", unicode: 958 },
    { alias: ["omicron"], fontFamily: "Math", unicode: 959 },
    { alias: ["pi"], fontFamily: "Math", unicode: 960 },
    { alias: ["rho"], fontFamily: "Math", unicode: 961 },
    { alias: ["sigma"], fontFamily: "Math", unicode: 963 },
    { alias: ["tau"], fontFamily: "Math", unicode: 964 },
    { alias: ["upsilon"], fontFamily: "Math", unicode: 965 },
    { alias: ["phi"], fontFamily: "Math", unicode: 981 },
    { alias: ["chi"], fontFamily: "Math", unicode: 967 },
    { alias: ["psi"], fontFamily: "Math", unicode: 968 },
    { alias: ["omega"], fontFamily: "Math", unicode: 969 },
    { alias: ["varepsilon"], fontFamily: "Math", unicode: 949 },
    { alias: ["varkappa"], fontFamily: "AMS", unicode: 1008 },
    { alias: ["vartheta"], fontFamily: "Math", unicode: 977 },
    { alias: ["thetasym"], fontFamily: "Math", unicode: 977 },
    { alias: ["varpi"], fontFamily: "Math", unicode: 982 },
    { alias: ["varrho"], fontFamily: "Math", unicode: 1009 },
    { alias: ["varsigma"], fontFamily: "Math", unicode: 962 },
    { alias: ["varphi"], fontFamily: "Math", unicode: 966 },
    { alias: ["digamma"], fontFamily: "AMS", unicode: 989 },

	//sets
    { alias: ["natural-numbers"], fontFamily: "AMS", unicode: 78 },
    { alias: ["integers"], fontFamily: "AMS", unicode: 90 },
    { alias: ["rational-numbers"], fontFamily: "AMS", unicode: 81 },
    { alias: ["real-numbers"], fontFamily: "AMS", unicode: 82 },
    { alias: ["complex-numbers"], fontFamily: "AMS", unicode: 67 },

    //misc
    { alias: ["imath"], fontFamily: "Main", unicode: 305 },
    { alias: ["jmath"], fontFamily: "Main", unicode: 567 },
    { alias: ["nabla"], fontFamily: "Main", unicode: 8711 },
    { alias: ["partial"], fontFamily: "Main", unicode: 8706 },
    { alias: ["big-empty"], fontFamily: "Main", unicode: 216 },
    { alias: ["empty"], fontFamily: "Main", unicode: 248 },
    { alias: ["aleph"], fontFamily: "Main", unicode: 8501 },
    { alias: ["hbar"], fontFamily: "Main", unicode: 8463 },
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
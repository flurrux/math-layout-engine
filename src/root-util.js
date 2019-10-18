import { getGlyphContours, scaleContours } from "./opentype-util";
import * as R from 'ramda';

const rootData = [
    {
        "fontFamily": "Size1",
        "bbox": {
            "xMin": 0.111,
            "yMin": -0.35,
            "xMax": 1.02,
            "yMax": 0.85
        },
        "contours": [
            [
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.263,
                    "y": 0.249
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.264,
                    "y": 0.249
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.366,
                    "y": 0.011
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.469,
                    "y": -0.227
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.47,
                    "y": -0.228
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.98,
                    "y": 0.829
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.982,
                    "y": 0.839
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.989,
                    "y": 0.85
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 0.85
                },
                //upper tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 0.85
                },

                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 1.017,
                //     "y": 0.85
                // },

                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 0.832
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 0.832
                },

                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 0.826
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.741,
                    "y": 0.243
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.683,
                    "y": 0.122
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.527,
                    "y": -0.202
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.46,
                    "y": -0.342
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.459,
                    "y": -0.343
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.452,
                    "y": -0.35
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.436,
                    "y": -0.35
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -0.349
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.315,
                    "y": -0.096
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.206,
                    "y": 0.156
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.205,
                    "y": 0.156
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.189,
                    "y": 0.144
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.171,
                    "y": 0.13
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.138,
                    "y": 0.104
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.137,
                    "y": 0.104
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.111,
                    "y": 0.13
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": true,
                    "x": 0.187,
                    "y": 0.189
                }
            ]
        ]
    },
    {
        "fontFamily": "Size2",
        "bbox": {
            "xMin": 0.111,
            "yMin": -0.65,
            "xMax": 1.02,
            "yMax": 1.15
        },
        "contours": [
            [
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 1.15
                },

                //upper tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 1.15
                },
                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 1.018,
                //     "y": 1.15
                // },
                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.132
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.132
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.128
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.478,
                    "y": -0.588
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.46,
                    "y": -0.643
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.453,
                    "y": -0.65
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.436,
                    "y": -0.65
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -0.65
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.422,
                    "y": -0.645
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.417,
                    "y": -0.625
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.364,
                    "y": -0.437
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.203,
                    "y": 0.119
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.188,
                    "y": 0.101
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.17,
                    "y": 0.08
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.138,
                    "y": 0.041
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.129,
                    "y": 0.049
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.111,
                    "y": 0.067
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.136,
                    "y": 0.097
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.176,
                    "y": 0.146
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.212,
                    "y": 0.188
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.264,
                    "y": 0.248
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.472,
                    "y": -0.474
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.556,
                    "y": -0.211
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.81,
                    "y": 0.595
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.971,
                    "y": 1.106
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.983,
                    "y": 1.14
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": true,
                    "x": 0.989,
                    "y": 1.15
                }
            ]
        ]
    },
    {
        "fontFamily": "Size3",
        "bbox": {
            "xMin": 0.111,
            "yMin": -0.95,
            "xMax": 1.02,
            "yMax": 1.45
        },
        "contours": [
            [
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -0.948
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.422,
                    "y": -0.947
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.203,
                    "y": 0.079
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.202,
                    "y": 0.08
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.202,
                    "y": 0.083
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.17,
                    "y": 0.031
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.163,
                    "y": 0.02
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.146,
                    "y": -0.008
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.142,
                    "y": -0.014
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.137,
                    "y": -0.021
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.131,
                    "y": -0.016
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.124,
                    "y": -0.008
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.111,
                    "y": 0.005
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.187,
                    "y": 0.127
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.264,
                    "y": 0.248
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.473,
                    "y": -0.72
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.473,
                    "y": -0.717
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.981,
                    "y": 1.435
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.983,
                    "y": 1.44
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.989,
                    "y": 1.45
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 1.45
                },
                //upper tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 1.45
                },
                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 1.007,
                //     "y": 1.45
                // },
                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 1.019,
                //     "y": 1.44
                // },
                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.433
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.433
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.425
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.464,
                    "y": -0.937
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.46,
                    "y": -0.941
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.457,
                    "y": -0.95
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.436,
                    "y": -0.95
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": true,
                    "x": 0.424,
                    "y": -0.95
                }
            ]
        ]
    },
    {
        "fontFamily": "Size4",
        "bbox": {
            "xMin": 0.111,
            "yMin": -1.25,
            "xMax": 1.02,
            "yMax": 1.75
        },
        "contours": [
            [
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.473,
                    "y": -0.963
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.982,
                    "y": 1.736
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.983,
                    "y": 1.739
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.988,
                    "y": 1.75
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.001,
                    "y": 1.75
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 1.008,
                    "y": 1.75
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 1.019,
                    "y": 1.74
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.733
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 1.02,
                    "y": 1.726
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.463,
                    "y": -1.238
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.46,
                    "y": -1.241
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.457,
                    "y": -1.25
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.436,
                    "y": -1.25
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -1.25
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -1.248
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.424,
                    "y": -1.246
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.408,
                    "y": -1.156
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.332,
                    "y": -0.716
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.201,
                    "y": 0.044
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.201,
                    "y": 0.046
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.169,
                    "y": -0.018
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.153,
                    "y": -0.05
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.137,
                    "y": -0.083
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.111,
                    "y": -0.057
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.187,
                    "y": 0.096
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.264,
                    "y": 0.247
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.265,
                    "y": 0.246
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.369,
                    "y": -0.357
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": true,
                    "x": 0.47,
                    "y": -0.958
                }
            ]
        ]
    },
    {
        "fontFamily": "Size4",
        "bbox": {
            "xMin": 0.111,
            "yMin": -0.885,
            "xMax": 0.742,
            "yMax": 0.935
        },
        "contours": [
            [
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.742,
                    "y": -0.871
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.741,
                    "y": -0.872
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.735,
                    "y": -0.878
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.733,
                    "y": -0.88
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.727,
                    "y": -0.883
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.72,
                    "y": -0.885
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.714,
                    "y": -0.885
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.702,
                    "y": -0.885
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.674,
                    "y": -0.801
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.649,
                    "y": -0.723
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.434,
                    "y": -0.074
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.222,
                    "y": 0.569
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.137,
                    "y": 0.399
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.131,
                    "y": 0.404
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.124,
                    "y": 0.412
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.111,
                    "y": 0.425
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.188,
                    "y": 0.58
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.265,
                    "y": 0.736
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.364,
                    "y": 0.437
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.484,
                    "y": 0.075
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.702,
                    "y": -0.586
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.702,
                    "y": 0.168
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.703,
                    "y": 0.922
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.713,
                    "y": 0.935
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.722,
                    "y": 0.935
                },
                {
                    "onCurve": false,
                    "lastPointOfContour": false,
                    "x": 0.734,
                    "y": 0.935
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": true,
                    "x": 0.742,
                    "y": 0.92
                }
            ]
        ]
    }
];

const roofAttachements = [
    [8, 10], [0, 2], [20, 23], [4, 7], [22, 26]
];
const tailIndices = [
    [9, 10], [1, 2], [21, 22], 
];

const verticalRootHeight = 1807;
const indexPositions = [
    [520, 290], [520, 290], [520, 290], [520, 290], [540, 800]
];

const getGlyphByIndex = (font, index) => font.glyphs.glyphs[index];

const getFontKeyForRootHeight = (fontMap, height) => {
    for (let i = 0; i < rootFontKeys.length - 1; i++){
        const fontKey = rootFontKeys[i];
        const font = fontMap[fontKey];
        const glyph = getGlyphByIndex(font, rootGlyphIndices[i]);
        const glyphHeight = glyph.yMax - glyph.yMin;
        if (glyphHeight > height){
            return {
                fontKey, fontIndex: i,
                sizeRatio: height / glyphHeight,
                remainingHeight: glyphHeight - height
            };
        }
    }

    return null;
};

//{ contours, innerStartX, metrics }
export const createRoot = (fontMap, width, height, margin=0) => {
    const keyData = getFontKeyForRootHeight(fontMap, height + margin);
    if (keyData){
        const { fontIndex } = keyData;
        const glyph = getGlyphByIndex(fontMap[keyData.fontKey], rootGlyphIndices[fontIndex]);
        const glyphScale = Math.min(0.7, keyData.sizeRatio) / 0.7;
        const contour = scaleContours(glyphScale, getGlyphContours(glyph))[0];
        const glyphMetrics = R.map(val => val * glyphScale, R.pick(["xMax", "yMin", "yMax"], glyph));


        const attachementInds = roofAttachements[fontIndex];
        const endX = glyphMetrics.xMax + width;

        const extendedContour = [
            ...contour.slice(0, attachementInds[0] + 1),
            { ...contour[attachementInds[0]], x: endX },
            { ...contour[attachementInds[1]], x: endX },
            ...contour.slice(attachementInds[1])
        ];
        const extendedContours = [extendedContour];

        return {
            contours: extendedContours,
            innerStartX: glyphMetrics.xMax, 
            indexCorner: indexPositions[fontIndex],
            metrics: {
                width: endX,
                yMin: glyphMetrics.yMin,
                yMax: glyphMetrics.yMax
            }
        };
    }
    else {
        const fontIndex = rootFontKeys.length;
        const glyph = getGlyphByIndex(fontMap["KaTeX_Size4"], rootGlyphIndices[fontIndex]);
        const contour = getGlyphContours(glyph)[0];
        const endX = glyph.advanceWidth + width;
        const roofStartY = -885 + height + margin;
        const roofThickness = 17;
        const roofEndY = roofStartY + roofThickness;

        const extendedContours = [[
            ...contour.slice(0, 22),
            { ...contour[22], y: roofEndY },
            { ...contour[22], y: roofEndY, x: endX },
            { ...contour[26], y: roofStartY, x: endX },
            { ...contour[26], y: roofStartY },
            ...contour.slice(27)
        ]];

        return {
            contours: extendedContours,
            innerStartX: 1056,
            indexCorner: indexPositions[fontIndex],
            metrics: {
                width: endX,
                yMin: glyph.yMin,
                yMax: roofEndY
            }
        };
    }
};

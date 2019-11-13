import { scaleContours, Contour } from "../../opentype";
import { map } from 'ramda';
import { BoundingBox, Vector2, ContoursNode } from '../../types';

interface GlyphData {
    fontFamily: string,
    innerHeight: number
    bbox: BoundingBox,
    contours: Contour[],
    advanceWidth?: number
};

const rootData : GlyphData[] = [
    {
		"fontFamily": "Size1",
		"innerHeight": 1.146,
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
                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.005,
                    "y": 0.796
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.005,
                    "y": 0.796
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
		"innerHeight": 1.746,
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
                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.008,
                    "y": 1.096
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.008,
                    "y": 1.096
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
		"innerHeight": 2.346,
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
                //lower tail-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.011,
                    "y": 1.396
                },
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.011,
                    "y": 1.396
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
		"innerHeight": 2.946,
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
				//upper tail-point
				{
					"onCurve": true,
					"lastPointOfContour": false,
					"x": 1.001,
					"y": 1.75
				},
				//lower tail-point
				{
					"onCurve": true,
					"lastPointOfContour": false,
					"x": 1.013,
					"y": 1.696
				},
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 1.013,
					"y": 1.696
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
		"innerHeight": 1.805,
        "bbox": {
            "xMin": 0.111,
            "yMin": -0.885,
            "xMax": 0.742,
            "yMax": 0.935
		},
		"advanceWidth": 1.056,
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
				//left tower-point
                {
                    "onCurve": true,
                    "lastPointOfContour": false,
                    "x": 0.703,
                    "y": 0.92
				},
				//upper tail-point
				{
					"onCurve": true,
					"lastPointOfContour": false,
					"x": 0.703,
					"y": 0.92
				},
                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 0.713,
                //     "y": 0.935
                // },
                // {
                //     "onCurve": true,
                //     "lastPointOfContour": false,
                //     "x": 0.722,
                //     "y": 0.935
                // },
                // {
                //     "onCurve": false,
                //     "lastPointOfContour": false,
                //     "x": 0.734,
                //     "y": 0.935
				// },
				//lower tail-point
				{
					"onCurve": true,
					"lastPointOfContour": true,
					"x": 0.742,
					"y": 0.92
				},
				//right tower-point
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
const extensionIndices : Vector2[] = [
    [9, 10], [1, 2], [21, 22], [5, 6], [22, 25]
];

const indexPositions : Vector2[] = [
    [0.52, 0.29], [0.52, 0.29], [0.52, 0.29], [0.52, 0.29], [0.54, 0.8]
];
const roofThickness = 0.054;

interface ModifiedGlyphPoint {
    index: number,
    point: {
        x: number, 
        y: number
    }
};

const moveContourPoints = (contour: Contour, movedPoints: ModifiedGlyphPoint[]) : Contour => contour.map((glyphPoint, index) => {
	const point : { x: number, y: number } = (movedPoints.find(mov => mov.index === index) || { point: { x: glyphPoint.x, y: glyphPoint.y } }).point;
	return { ...glyphPoint, ...point }
});
export const extendRootTail = (rootIndex: number, width: number) : Contour => {
	const extendInds = extensionIndices[rootIndex];
	const rootEntry = rootData[rootIndex];
	const contour = rootEntry.contours[0];
	const tailX = contour[extendInds[1]].x + width;
	return moveContourPoints(contour, [
		{ index: extendInds[0], point: { x: tailX, y: contour[extendInds[0]].y } },
		{ index: extendInds[1], point: { x: tailX, y: contour[extendInds[1]].y } },
	]);
};
export const extendRootBrella = (height: number, width: number) : Contour => {
	const rootEntry = rootData[4];
	const bottomY = rootEntry.bbox.yMin;
	const lowerRoofY = bottomY + height;
	const upperRoofY = lowerRoofY + roofThickness;
	const tailX = rootEntry.advanceWidth + width;
	const contour = rootEntry.contours[0];
	return moveContourPoints(contour, [
		{ index: 22, point: { x: contour[22].x, y: upperRoofY } },
		{ index: 23, point: { x: tailX, y: upperRoofY } },
		{ index: 24, point: { x: tailX, y: lowerRoofY } },
		{ index: 25, point: { x: contour[25].x, y: lowerRoofY } }
	]);
};

//height means distance from lowest point to bottom of root-"roof"
const getRootIndexByHeight = (height: number) : number => {
	for (let i = 0; i < 4; i++){
		if (rootData[i].innerHeight > height){
			return i;
		}
	}
	return 4;
};

export interface RootContoursNode extends ContoursNode {
    innerStartX: number,
    innerHeight: number, 
    indexCorner: Vector2
};

//{ contours, innerStartX, metrics }
export const createRadical = (width: number, height: number) : RootContoursNode => {
	const rootIndex = getRootIndexByHeight(height);
	const rootEntry = rootData[rootIndex];
	const { bbox } = rootEntry;
	if (rootIndex < 4){
		const heightRatio = height / rootEntry.innerHeight;
		const scale = Math.min(1, Math.min(heightRatio, 0.9) / 0.9);
		const scaledBbox = map(val => val * scale, bbox);
		const contour = extendRootTail(rootIndex, width / scale);
		const scaledContours = scaleContours(scale, [contour]);
		return {
            type: "contours",
			contours: scaledContours,
			innerStartX: scaledBbox.xMax,
            innerHeight: scale * rootEntry.innerHeight,
            indexCorner: indexPositions[rootIndex],
			dimensions: {
				width: scaledBbox.xMax + width,
				yMin: scaledBbox.yMin,
				yMax: scaledBbox.yMax
			}
		}
	}
	else {
		const startX = rootData[rootIndex].advanceWidth;
		return {
            type: "contours",
			contours: [extendRootBrella(height, width)],
			innerStartX: startX,
            innerHeight: height - bbox.yMin,
            indexCorner: indexPositions[rootIndex],
			dimensions: {
				width: startX + width,
				yMin: bbox.yMin,
				yMax: bbox.yMin + height
			}
		}
	}
};

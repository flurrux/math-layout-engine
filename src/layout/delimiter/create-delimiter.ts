import { transformContour, transformBbox, BoundingBox, Contour, GlyphPoint } from "../../opentype";
import { pick } from 'ramda';
import { Vector2, ContoursNode, Dimensions } from '../../types';

/*
delimiters:

parenthesis (), 40 41
braces {}, 123 125
brackets [], 91 93
angle brackets: ⟨⟩, 10216 10217

vertical lines: |, 8739
ceil: 8968 8969
floor: 8970 8971


*/

const lastInArray = <T>(array: T[]) : T => array[array.length - 1];

interface GlyphData {
    fontId: string,
    bbox: BoundingBox,
    contours: Contour[],
    advanceWidth: number
};

export const delimiterFontData : { [unicode: string]: GlyphData[] } = {
    "40": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.094,
                "yMin": -0.25,
                "xMax": 0.333,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -0.241
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.315,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.302,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.295,
                        "y": -0.244
                    },
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": -0.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.094,
                        "y": -0.062
                    },
                    {
                        "onCurve": true,
                        "x": 0.094,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.094,
                        "y": 0.372
                    },
                    {
                        "onCurve": true,
                        "x": 0.123,
                        "y": 0.473
                    },
                    {
                        "onCurve": false,
                        "x": 0.169,
                        "y": 0.63
                    },
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": 0.726
                    },
                    {
                        "onCurve": false,
                        "x": 0.281,
                        "y": 0.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.299,
                        "y": 0.747
                    },
                    {
                        "onCurve": true,
                        "x": 0.302,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.315,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.327,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.741
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.737
                    },
                    {
                        "onCurve": true,
                        "x": 0.322,
                        "y": 0.726
                    },
                    {
                        "onCurve": false,
                        "x": 0.167,
                        "y": 0.562
                    },
                    {
                        "onCurve": false,
                        "x": 0.167,
                        "y": -0.062
                    },
                    {
                        "onCurve": true,
                        "x": 0.322,
                        "y": -0.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": -0.237
                    }
                ]
            ],
            "advanceWidth": 0.389
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.152,
                "yMin": -0.349,
                "xMax": 0.422,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.152,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 0.448
                    },
                    {
                        "onCurve": false,
                        "x": 0.275,
                        "y": 0.753
                    },
                    {
                        "onCurve": true,
                        "x": 0.388,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.416,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 0.844
                    },
                    {
                        "onCurve": true,
                        "x": 0.422,
                        "y": 0.841
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 0.837
                    },
                    {
                        "onCurve": true,
                        "x": 0.412,
                        "y": 0.826
                    },
                    {
                        "onCurve": false,
                        "x": 0.236,
                        "y": 0.628
                    },
                    {
                        "onCurve": true,
                        "x": 0.236,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.236,
                        "y": -0.125
                    },
                    {
                        "onCurve": true,
                        "x": 0.412,
                        "y": -0.325
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.336
                    },
                    {
                        "onCurve": true,
                        "x": 0.422,
                        "y": -0.34
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.343
                    },
                    {
                        "onCurve": true,
                        "x": 0.416,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.388,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.275,
                        "y": -0.252
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 0.053
                    }
                ]
            ],
            "advanceWidth": 0.458
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.18,
                "yMin": -0.649,
                "xMax": 0.561,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.561,
                        "y": -0.64
                    },
                    {
                        "onCurve": false,
                        "x": 0.561,
                        "y": -0.643
                    },
                    {
                        "onCurve": true,
                        "x": 0.555,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.527,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": -0.562
                    },
                    {
                        "onCurve": false,
                        "x": 0.273,
                        "y": -0.311
                    },
                    {
                        "onCurve": true,
                        "x": 0.232,
                        "y": -0.161
                    },
                    {
                        "onCurve": false,
                        "x": 0.18,
                        "y": 0.026
                    },
                    {
                        "onCurve": true,
                        "x": 0.18,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.18,
                        "y": 0.473
                    },
                    {
                        "onCurve": true,
                        "x": 0.232,
                        "y": 0.662
                    },
                    {
                        "onCurve": false,
                        "x": 0.316,
                        "y": 0.969
                    },
                    {
                        "onCurve": true,
                        "x": 0.527,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.555,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.561,
                        "y": 1.144
                    },
                    {
                        "onCurve": true,
                        "x": 0.561,
                        "y": 1.141
                    },
                    {
                        "onCurve": false,
                        "x": 0.561,
                        "y": 1.137
                    },
                    {
                        "onCurve": true,
                        "x": 0.548,
                        "y": 1.123
                    },
                    {
                        "onCurve": false,
                        "x": 0.518,
                        "y": 1.09
                    },
                    {
                        "onCurve": true,
                        "x": 0.486,
                        "y": 1.05
                    },
                    {
                        "onCurve": false,
                        "x": 0.313,
                        "y": 0.816
                    },
                    {
                        "onCurve": true,
                        "x": 0.28,
                        "y": 0.445
                    },
                    {
                        "onCurve": false,
                        "x": 0.272,
                        "y": 0.368
                    },
                    {
                        "onCurve": true,
                        "x": 0.272,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.272,
                        "y": 0.133
                    },
                    {
                        "onCurve": true,
                        "x": 0.28,
                        "y": 0.056
                    },
                    {
                        "onCurve": false,
                        "x": 0.318,
                        "y": -0.374
                    },
                    {
                        "onCurve": true,
                        "x": 0.548,
                        "y": -0.622
                    },
                    {
                        "onCurve": false,
                        "x": 0.561,
                        "y": -0.636
                    }
                ]
            ],
            "advanceWidth": 0.597
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.209,
                "yMin": -0.949,
                "xMax": 0.701,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.701,
                        "y": -0.94
                    },
                    {
                        "onCurve": false,
                        "x": 0.701,
                        "y": -0.943
                    },
                    {
                        "onCurve": true,
                        "x": 0.695,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.664,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.66,
                        "y": -0.945
                    },
                    {
                        "onCurve": false,
                        "x": 0.63,
                        "y": -0.921
                    },
                    {
                        "onCurve": true,
                        "x": 0.573,
                        "y": -0.86
                    },
                    {
                        "onCurve": false,
                        "x": 0.263,
                        "y": -0.519
                    },
                    {
                        "onCurve": true,
                        "x": 0.216,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.209,
                        "y": 0.133
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.209,
                        "y": 0.367
                    },
                    {
                        "onCurve": true,
                        "x": 0.216,
                        "y": 0.449
                    },
                    {
                        "onCurve": false,
                        "x": 0.263,
                        "y": 1.02
                    },
                    {
                        "onCurve": true,
                        "x": 0.573,
                        "y": 1.361
                    },
                    {
                        "onCurve": false,
                        "x": 0.63,
                        "y": 1.422
                    },
                    {
                        "onCurve": true,
                        "x": 0.66,
                        "y": 1.446
                    },
                    {
                        "onCurve": true,
                        "x": 0.664,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.695,
                        "y": 1.45
                    },
                    {
                        "onCurve": false,
                        "x": 0.701,
                        "y": 1.444
                    },
                    {
                        "onCurve": true,
                        "x": 0.701,
                        "y": 1.441
                    },
                    {
                        "onCurve": false,
                        "x": 0.701,
                        "y": 1.437
                    },
                    {
                        "onCurve": true,
                        "x": 0.69,
                        "y": 1.425
                    },
                    {
                        "onCurve": false,
                        "x": 0.495,
                        "y": 1.223
                    },
                    {
                        "onCurve": false,
                        "x": 0.306,
                        "y": 0.645
                    },
                    {
                        "onCurve": true,
                        "x": 0.306,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.306,
                        "y": -0.067
                    },
                    {
                        "onCurve": true,
                        "x": 0.37,
                        "y": -0.323
                    },
                    {
                        "onCurve": false,
                        "x": 0.462,
                        "y": -0.687
                    },
                    {
                        "onCurve": true,
                        "x": 0.69,
                        "y": -0.924
                    },
                    {
                        "onCurve": false,
                        "x": 0.701,
                        "y": -0.936
                    }
                ]
            ],
            "advanceWidth": 0.736
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.237,
                "yMin": -1.249,
                "xMax": 0.758,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": -1.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.752,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.736,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.718,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.717,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.711,
                        "y": -1.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.672,
                        "y": -1.199
                    },
                    {
                        "onCurve": false,
                        "x": 0.237,
                        "y": -0.706
                    },
                    {
                        "onCurve": true,
                        "x": 0.237,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.237,
                        "y": 1.206
                    },
                    {
                        "onCurve": true,
                        "x": 0.672,
                        "y": 1.7
                    },
                    {
                        "onCurve": false,
                        "x": 0.697,
                        "y": 1.73
                    },
                    {
                        "onCurve": true,
                        "x": 0.716,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.718,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.735,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.752,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": 1.744
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": 1.738
                    },
                    {
                        "onCurve": true,
                        "x": 0.744,
                        "y": 1.719
                    },
                    {
                        "onCurve": false,
                        "x": 0.56,
                        "y": 1.489
                    },
                    {
                        "onCurve": true,
                        "x": 0.463,
                        "y": 1.176
                    },
                    {
                        "onCurve": false,
                        "x": 0.348,
                        "y": 0.802
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.348,
                        "y": -0.301
                    },
                    {
                        "onCurve": true,
                        "x": 0.463,
                        "y": -0.675
                    },
                    {
                        "onCurve": false,
                        "x": 0.56,
                        "y": -0.988
                    },
                    {
                        "onCurve": true,
                        "x": 0.744,
                        "y": -1.218
                    }
                ]
            ],
            "advanceWidth": 0.792
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.237,
                "yMin": -1.249,
                "xMax": 0.758,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": -1.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.752,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.736,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.718,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.717,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.711,
                        "y": -1.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.672,
                        "y": -1.199
                    },
                    {
                        "onCurve": false,
                        "x": 0.237,
                        "y": -0.706
                    },
                    {
                        "onCurve": true,
                        "x": 0.237,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.237,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.237,
                        "y": 1.206
                    },
                    {
                        "onCurve": true,
                        "x": 0.672,
                        "y": 1.7
                    },
                    {
                        "onCurve": false,
                        "x": 0.697,
                        "y": 1.73
                    },
                    {
                        "onCurve": true,
                        "x": 0.716,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.718,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.735,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.752,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": 1.744
                    },
                    {
                        "onCurve": false,
                        "x": 0.758,
                        "y": 1.738
                    },
                    {
                        "onCurve": true,
                        "x": 0.744,
                        "y": 1.719
                    },
                    {
                        "onCurve": false,
                        "x": 0.56,
                        "y": 1.489
                    },
                    {
                        "onCurve": true,
                        "x": 0.463,
                        "y": 1.176
                    },
                    {
                        "onCurve": false,
                        "x": 0.348,
                        "y": 0.802
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.348,
                        "y": -0.301
                    },
                    {
                        "onCurve": true,
                        "x": 0.463,
                        "y": -0.675
                    },
                    {
                        "onCurve": false,
                        "x": 0.56,
                        "y": -0.988
                    },
                    {
                        "onCurve": true,
                        "x": 0.744,
                        "y": -1.218
                    }
                ]
            ],
            "advanceWidth": 0.792
        }
    ],
    "41": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.055,
                "yMin": -0.25,
                "xMax": 0.294,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.06,
                        "y": 0.749
                    },
                    {
                        "onCurve": true,
                        "x": 0.064,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.069,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.086,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.093,
                        "y": 0.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.114,
                        "y": 0.726
                    },
                    {
                        "onCurve": false,
                        "x": 0.294,
                        "y": 0.562
                    },
                    {
                        "onCurve": true,
                        "x": 0.294,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.294,
                        "y": 0.127
                    },
                    {
                        "onCurve": true,
                        "x": 0.265,
                        "y": 0.028
                    },
                    {
                        "onCurve": false,
                        "x": 0.219,
                        "y": -0.13
                    },
                    {
                        "onCurve": true,
                        "x": 0.114,
                        "y": -0.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.107,
                        "y": -0.232
                    },
                    {
                        "onCurve": false,
                        "x": 0.089,
                        "y": -0.247
                    },
                    {
                        "onCurve": true,
                        "x": 0.086,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.062,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.055,
                        "y": -0.246
                    },
                    {
                        "onCurve": true,
                        "x": 0.055,
                        "y": -0.238
                    },
                    {
                        "onCurve": false,
                        "x": 0.056,
                        "y": -0.237
                    },
                    {
                        "onCurve": true,
                        "x": 0.066,
                        "y": -0.225
                    },
                    {
                        "onCurve": false,
                        "x": 0.221,
                        "y": -0.064
                    },
                    {
                        "onCurve": false,
                        "x": 0.221,
                        "y": 0.564
                    },
                    {
                        "onCurve": true,
                        "x": 0.066,
                        "y": 0.725
                    },
                    {
                        "onCurve": false,
                        "x": 0.056,
                        "y": 0.737
                    },
                    {
                        "onCurve": true,
                        "x": 0.055,
                        "y": 0.738
                    },
                    {
                        "onCurve": false,
                        "x": 0.055,
                        "y": 0.746
                    }
                ]
            ],
            "advanceWidth": 0.389
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.035,
                "yMin": -0.349,
                "xMax": 0.305,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.305,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.305,
                        "y": 0.052
                    },
                    {
                        "onCurve": false,
                        "x": 0.183,
                        "y": -0.252
                    },
                    {
                        "onCurve": true,
                        "x": 0.069,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.043,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.035,
                        "y": -0.345
                    },
                    {
                        "onCurve": true,
                        "x": 0.035,
                        "y": -0.338
                    },
                    {
                        "onCurve": false,
                        "x": 0.037,
                        "y": -0.333
                    },
                    {
                        "onCurve": true,
                        "x": 0.047,
                        "y": -0.322
                    },
                    {
                        "onCurve": false,
                        "x": 0.221,
                        "y": -0.126
                    },
                    {
                        "onCurve": true,
                        "x": 0.221,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.221,
                        "y": 0.627
                    },
                    {
                        "onCurve": true,
                        "x": 0.047,
                        "y": 0.823
                    },
                    {
                        "onCurve": false,
                        "x": 0.037,
                        "y": 0.834
                    },
                    {
                        "onCurve": true,
                        "x": 0.035,
                        "y": 0.839
                    },
                    {
                        "onCurve": false,
                        "x": 0.035,
                        "y": 0.847
                    },
                    {
                        "onCurve": false,
                        "x": 0.043,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.069,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.182,
                        "y": 0.753
                    },
                    {
                        "onCurve": false,
                        "x": 0.305,
                        "y": 0.448
                    }
                ]
            ],
            "advanceWidth": 0.458
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.035,
                "yMin": -0.649,
                "xMax": 0.416,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.035,
                        "y": 1.138
                    },
                    {
                        "onCurve": false,
                        "x": 0.035,
                        "y": 1.146
                    },
                    {
                        "onCurve": false,
                        "x": 0.043,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.069,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.171,
                        "y": 1.063
                    },
                    {
                        "onCurve": false,
                        "x": 0.323,
                        "y": 0.812
                    },
                    {
                        "onCurve": true,
                        "x": 0.364,
                        "y": 0.662
                    },
                    {
                        "onCurve": false,
                        "x": 0.416,
                        "y": 0.475
                    },
                    {
                        "onCurve": true,
                        "x": 0.416,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.416,
                        "y": 0.028
                    },
                    {
                        "onCurve": true,
                        "x": 0.364,
                        "y": -0.161
                    },
                    {
                        "onCurve": false,
                        "x": 0.28,
                        "y": -0.468
                    },
                    {
                        "onCurve": true,
                        "x": 0.069,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.042,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.035,
                        "y": -0.645
                    },
                    {
                        "onCurve": true,
                        "x": 0.035,
                        "y": -0.637
                    },
                    {
                        "onCurve": false,
                        "x": 0.036,
                        "y": -0.636
                    },
                    {
                        "onCurve": true,
                        "x": 0.048,
                        "y": -0.622
                    },
                    {
                        "onCurve": false,
                        "x": 0.278,
                        "y": -0.374
                    },
                    {
                        "onCurve": true,
                        "x": 0.316,
                        "y": 0.056
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": 0.133
                    },
                    {
                        "onCurve": true,
                        "x": 0.324,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": 0.368
                    },
                    {
                        "onCurve": true,
                        "x": 0.316,
                        "y": 0.445
                    },
                    {
                        "onCurve": false,
                        "x": 0.283,
                        "y": 0.816
                    },
                    {
                        "onCurve": true,
                        "x": 0.11,
                        "y": 1.05
                    },
                    {
                        "onCurve": false,
                        "x": 0.078,
                        "y": 1.091
                    },
                    {
                        "onCurve": true,
                        "x": 0.048,
                        "y": 1.123
                    },
                    {
                        "onCurve": false,
                        "x": 0.036,
                        "y": 1.137
                    }
                ]
            ],
            "advanceWidth": 0.597
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.034,
                "yMin": -0.949,
                "xMax": 0.526,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.428,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.428,
                        "y": 1.044
                    },
                    {
                        "onCurve": true,
                        "x": 0.034,
                        "y": 1.438
                    },
                    {
                        "onCurve": false,
                        "x": 0.034,
                        "y": 1.446
                    },
                    {
                        "onCurve": false,
                        "x": 0.042,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.071,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.075,
                        "y": 1.446
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": 1.422
                    },
                    {
                        "onCurve": true,
                        "x": 0.162,
                        "y": 1.361
                    },
                    {
                        "onCurve": false,
                        "x": 0.472,
                        "y": 1.02
                    },
                    {
                        "onCurve": true,
                        "x": 0.519,
                        "y": 0.449
                    },
                    {
                        "onCurve": false,
                        "x": 0.526,
                        "y": 0.367
                    },
                    {
                        "onCurve": true,
                        "x": 0.526,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.526,
                        "y": 0.134
                    },
                    {
                        "onCurve": true,
                        "x": 0.519,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.472,
                        "y": -0.519
                    },
                    {
                        "onCurve": true,
                        "x": 0.162,
                        "y": -0.86
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": -0.921
                    },
                    {
                        "onCurve": true,
                        "x": 0.075,
                        "y": -0.945
                    },
                    {
                        "onCurve": true,
                        "x": 0.071,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": -0.949
                    },
                    {
                        "onCurve": false,
                        "x": 0.041,
                        "y": -0.949
                    },
                    {
                        "onCurve": false,
                        "x": 0.034,
                        "y": -0.945
                    },
                    {
                        "onCurve": true,
                        "x": 0.034,
                        "y": -0.937
                    },
                    {
                        "onCurve": false,
                        "x": 0.081,
                        "y": -0.89
                    },
                    {
                        "onCurve": true,
                        "x": 0.14,
                        "y": -0.813
                    },
                    {
                        "onCurve": false,
                        "x": 0.428,
                        "y": -0.429
                    }
                ]
            ],
            "advanceWidth": 0.736
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.033,
                "yMin": -1.249,
                "xMax": 0.554,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.033,
                        "y": 1.741
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.052,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.06,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.073,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.08,
                        "y": 1.746
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": 1.7
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": 1.207
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": -0.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": -1.199
                    },
                    {
                        "onCurve": false,
                        "x": 0.08,
                        "y": -1.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.068,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.061,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.033,
                        "y": -1.239
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": -1.236
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": -1.215
                    },
                    {
                        "onCurve": false,
                        "x": 0.218,
                        "y": -1.006
                    },
                    {
                        "onCurve": true,
                        "x": 0.311,
                        "y": -0.727
                    },
                    {
                        "onCurve": false,
                        "x": 0.443,
                        "y": -0.335
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.443,
                        "y": 0.836
                    },
                    {
                        "onCurve": true,
                        "x": 0.311,
                        "y": 1.228
                    },
                    {
                        "onCurve": false,
                        "x": 0.218,
                        "y": 1.507
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": 1.716
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": 1.737
                    }
                ]
            ],
            "advanceWidth": 0.792
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.033,
                "yMin": -1.249,
                "xMax": 0.554,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.033,
                        "y": 1.741
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.052,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.06,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.073,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.08,
                        "y": 1.746
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": 1.7
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": 1.207
                    },
                    {
                        "onCurve": true,
                        "x": 0.554,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.554,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": -0.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": -1.199
                    },
                    {
                        "onCurve": false,
                        "x": 0.08,
                        "y": -1.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.074,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.068,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.061,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.056,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.033,
                        "y": -1.239
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": -1.236
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": -1.215
                    },
                    {
                        "onCurve": false,
                        "x": 0.218,
                        "y": -1.006
                    },
                    {
                        "onCurve": true,
                        "x": 0.311,
                        "y": -0.727
                    },
                    {
                        "onCurve": false,
                        "x": 0.443,
                        "y": -0.335
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.443,
                        "y": 0.836
                    },
                    {
                        "onCurve": true,
                        "x": 0.311,
                        "y": 1.228
                    },
                    {
                        "onCurve": false,
                        "x": 0.218,
                        "y": 1.507
                    },
                    {
                        "onCurve": true,
                        "x": 0.05,
                        "y": 1.716
                    },
                    {
                        "onCurve": false,
                        "x": 0.033,
                        "y": 1.737
                    }
                ]
            ],
            "advanceWidth": 0.792
        }
	],
	
    "91": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.118,
                "yMin": -0.25,
                "xMax": 0.255,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.118,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.118,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.255,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.255,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.158,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.158,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.255,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.255,
                        "y": -0.25
                    }
                ]
            ],
            "advanceWidth": 0.278
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.202,
                "yMin": -0.349,
                "xMax": 0.394,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": -0.349
                    }
                ]
            ],
            "advanceWidth": 0.417
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.224,
                "yMin": -0.649,
                "xMax": 0.455,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.455,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.455,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.455,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.455,
                        "y": -0.649
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.247,
                "yMin": -0.949,
                "xMax": 0.516,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.247,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.247,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.516,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.516,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.516,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.516,
                        "y": -0.949
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.269,
                "yMin": -1.249,
                "xMax": 0.577,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.577,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.577,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.577,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.577,
                        "y": -1.249
                    }
                ]
            ],
            "advanceWidth": 0.583
        }
    ],
    "93": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.022,
                "yMin": -0.25,
                "xMax": 0.159,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.159,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.159,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": 0.71
                    }
                ]
            ],
            "advanceWidth": 0.278
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.022,
                "yMin": -0.349,
                "xMax": 0.214,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": 0.81
                    }
                ]
            ],
            "advanceWidth": 0.417
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.016,
                "yMin": -0.649,
                "xMax": 0.247,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.247,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.247,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.196,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.196,
                        "y": 1.099
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.011,
                "yMin": -0.949,
                "xMax": 0.28,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.28,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.28,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.218,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.218,
                        "y": 1.388
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.005,
                "yMin": -1.249,
                "xMax": 0.313,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.313,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.313,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.24,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.24,
                        "y": 1.677
                    }
                ]
            ],
            "advanceWidth": 0.583
        }
	],
	
    "123": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.065,
                "yMin": -0.25,
                "xMax": 0.434,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.434,
                        "y": -0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": -0.244
                    },
                    {
                        "onCurve": true,
                        "x": 0.428,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.334,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.225,
                        "y": -0.199
                    },
                    {
                        "onCurve": true,
                        "x": 0.212,
                        "y": -0.145
                    },
                    {
                        "onCurve": false,
                        "x": 0.21,
                        "y": -0.138
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0
                    },
                    {
                        "onCurve": false,
                        "x": 0.209,
                        "y": 0.021
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.208,
                        "y": 0.142
                    },
                    {
                        "onCurve": true,
                        "x": 0.204,
                        "y": 0.153
                    },
                    {
                        "onCurve": false,
                        "x": 0.203,
                        "y": 0.154
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": 0.155
                    },
                    {
                        "onCurve": false,
                        "x": 0.191,
                        "y": 0.186
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": 0.231
                    },
                    {
                        "onCurve": true,
                        "x": 0.082,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.071,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": 0.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": 0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.071,
                        "y": 0.269
                    },
                    {
                        "onCurve": true,
                        "x": 0.082,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.191,
                        "y": 0.314
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": 0.345
                    },
                    {
                        "onCurve": false,
                        "x": 0.207,
                        "y": 0.357
                    },
                    {
                        "onCurve": false,
                        "x": 0.208,
                        "y": 0.383
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0.501
                    },
                    {
                        "onCurve": false,
                        "x": 0.21,
                        "y": 0.638
                    },
                    {
                        "onCurve": true,
                        "x": 0.212,
                        "y": 0.645
                    },
                    {
                        "onCurve": false,
                        "x": 0.22,
                        "y": 0.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.244,
                        "y": 0.698
                    },
                    {
                        "onCurve": false,
                        "x": 0.27,
                        "y": 0.724
                    },
                    {
                        "onCurve": true,
                        "x": 0.324,
                        "y": 0.74
                    },
                    {
                        "onCurve": false,
                        "x": 0.361,
                        "y": 0.748
                    },
                    {
                        "onCurve": true,
                        "x": 0.377,
                        "y": 0.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.379,
                        "y": 0.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.402,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.408,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.428,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": 0.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.434,
                        "y": 0.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": 0.719
                    },
                    {
                        "onCurve": true,
                        "x": 0.431,
                        "y": 0.716
                    },
                    {
                        "onCurve": false,
                        "x": 0.429,
                        "y": 0.713
                    },
                    {
                        "onCurve": true,
                        "x": 0.415,
                        "y": 0.713
                    },
                    {
                        "onCurve": false,
                        "x": 0.359,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.322,
                        "y": 0.681
                    },
                    {
                        "onCurve": false,
                        "x": 0.302,
                        "y": 0.666
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": 0.647
                    },
                    {
                        "onCurve": false,
                        "x": 0.291,
                        "y": 0.634
                    },
                    {
                        "onCurve": true,
                        "x": 0.291,
                        "y": 0.499
                    },
                    {
                        "onCurve": false,
                        "x": 0.291,
                        "y": 0.369
                    },
                    {
                        "onCurve": true,
                        "x": 0.29,
                        "y": 0.363
                    },
                    {
                        "onCurve": false,
                        "x": 0.28,
                        "y": 0.285
                    },
                    {
                        "onCurve": true,
                        "x": 0.17,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.221,
                        "y": 0.232
                    },
                    {
                        "onCurve": false,
                        "x": 0.285,
                        "y": 0.18
                    },
                    {
                        "onCurve": true,
                        "x": 0.29,
                        "y": 0.137
                    },
                    {
                        "onCurve": false,
                        "x": 0.291,
                        "y": 0.131
                    },
                    {
                        "onCurve": true,
                        "x": 0.291,
                        "y": 0.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.291,
                        "y": -0.134
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": -0.147
                    },
                    {
                        "onCurve": false,
                        "x": 0.306,
                        "y": -0.175
                    },
                    {
                        "onCurve": false,
                        "x": 0.374,
                        "y": -0.211
                    },
                    {
                        "onCurve": true,
                        "x": 0.415,
                        "y": -0.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.429,
                        "y": -0.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.431,
                        "y": -0.216
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": -0.219
                    }
                ]
            ],
            "advanceWidth": 0.5
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.105,
                "yMin": -0.349,
                "xMax": 0.477,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": -0.343
                    },
                    {
                        "onCurve": true,
                        "x": 0.471,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.444,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.407,
                        "y": -0.338
                    },
                    {
                        "onCurve": false,
                        "x": 0.309,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": -0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.258,
                        "y": -0.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.25,
                        "y": -0.212
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": -0.051
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": -0.027
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": 0.012
                    },
                    {
                        "onCurve": false,
                        "x": 0.248,
                        "y": 0.118
                    },
                    {
                        "onCurve": true,
                        "x": 0.244,
                        "y": 0.128
                    },
                    {
                        "onCurve": false,
                        "x": 0.243,
                        "y": 0.129
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": 0.13
                    },
                    {
                        "onCurve": false,
                        "x": 0.224,
                        "y": 0.177
                    },
                    {
                        "onCurve": true,
                        "x": 0.162,
                        "y": 0.21
                    },
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": 0.224
                    },
                    {
                        "onCurve": true,
                        "x": 0.121,
                        "y": 0.228
                    },
                    {
                        "onCurve": false,
                        "x": 0.109,
                        "y": 0.232
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": 0.238
                    },
                    {
                        "onCurve": true,
                        "x": 0.105,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": 0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.109,
                        "y": 0.268
                    },
                    {
                        "onCurve": true,
                        "x": 0.121,
                        "y": 0.273
                    },
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": 0.277
                    },
                    {
                        "onCurve": true,
                        "x": 0.162,
                        "y": 0.291
                    },
                    {
                        "onCurve": false,
                        "x": 0.224,
                        "y": 0.324
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": 0.371
                    },
                    {
                        "onCurve": false,
                        "x": 0.243,
                        "y": 0.372
                    },
                    {
                        "onCurve": true,
                        "x": 0.244,
                        "y": 0.373
                    },
                    {
                        "onCurve": false,
                        "x": 0.248,
                        "y": 0.384
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": 0.469
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": 0.475
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": 0.489
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": 0.528
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": 0.552
                    },
                    {
                        "onCurve": true,
                        "x": 0.25,
                        "y": 0.714
                    },
                    {
                        "onCurve": false,
                        "x": 0.258,
                        "y": 0.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": 0.764
                    },
                    {
                        "onCurve": false,
                        "x": 0.312,
                        "y": 0.813
                    },
                    {
                        "onCurve": true,
                        "x": 0.422,
                        "y": 0.843
                    },
                    {
                        "onCurve": false,
                        "x": 0.44,
                        "y": 0.849
                    },
                    {
                        "onCurve": true,
                        "x": 0.441,
                        "y": 0.849
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.849
                    },
                    {
                        "onCurve": false,
                        "x": 0.445,
                        "y": 0.849
                    },
                    {
                        "onCurve": false,
                        "x": 0.449,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.455,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.457,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.471,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": 0.844
                    },
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": 0.83
                    },
                    {
                        "onCurve": false,
                        "x": 0.477,
                        "y": 0.812
                    },
                    {
                        "onCurve": true,
                        "x": 0.469,
                        "y": 0.81
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": 0.798
                    },
                    {
                        "onCurve": false,
                        "x": 0.349,
                        "y": 0.752
                    },
                    {
                        "onCurve": true,
                        "x": 0.338,
                        "y": 0.724
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.55
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.395
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.389
                    },
                    {
                        "onCurve": false,
                        "x": 0.326,
                        "y": 0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.295,
                        "y": 0.318
                    },
                    {
                        "onCurve": false,
                        "x": 0.257,
                        "y": 0.28
                    },
                    {
                        "onCurve": true,
                        "x": 0.181,
                        "y": 0.255
                    },
                    {
                        "onCurve": true,
                        "x": 0.169,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.184,
                        "y": 0.245
                    },
                    {
                        "onCurve": false,
                        "x": 0.275,
                        "y": 0.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": 0.167
                    },
                    {
                        "onCurve": false,
                        "x": 0.327,
                        "y": 0.14
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.112
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.106
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -0.049
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": -0.209
                    },
                    {
                        "onCurve": true,
                        "x": 0.338,
                        "y": -0.223
                    },
                    {
                        "onCurve": false,
                        "x": 0.349,
                        "y": -0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": -0.297
                    },
                    {
                        "onCurve": true,
                        "x": 0.469,
                        "y": -0.309
                    },
                    {
                        "onCurve": false,
                        "x": 0.477,
                        "y": -0.311
                    },
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": -0.329
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.119,
                "yMin": -0.649,
                "xMax": 0.547,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": -0.643
                    },
                    {
                        "onCurve": true,
                        "x": 0.541,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.528,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.515,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.503,
                        "y": -0.645
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": -0.582
                    },
                    {
                        "onCurve": true,
                        "x": 0.293,
                        "y": -0.466
                    },
                    {
                        "onCurve": false,
                        "x": 0.289,
                        "y": -0.449
                    },
                    {
                        "onCurve": false,
                        "x": 0.288,
                        "y": -0.407
                    },
                    {
                        "onCurve": true,
                        "x": 0.287,
                        "y": -0.2
                    },
                    {
                        "onCurve": true,
                        "x": 0.286,
                        "y": 0.042
                    },
                    {
                        "onCurve": true,
                        "x": 0.284,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.279,
                        "y": 0.077
                    },
                    {
                        "onCurve": true,
                        "x": 0.272,
                        "y": 0.092
                    },
                    {
                        "onCurve": false,
                        "x": 0.238,
                        "y": 0.177
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": 0.228
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": 0.238
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": 0.262
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": 0.27
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": 0.273
                    },
                    {
                        "onCurve": false,
                        "x": 0.238,
                        "y": 0.324
                    },
                    {
                        "onCurve": true,
                        "x": 0.272,
                        "y": 0.409
                    },
                    {
                        "onCurve": false,
                        "x": 0.279,
                        "y": 0.424
                    },
                    {
                        "onCurve": true,
                        "x": 0.284,
                        "y": 0.449
                    },
                    {
                        "onCurve": true,
                        "x": 0.286,
                        "y": 0.46
                    },
                    {
                        "onCurve": true,
                        "x": 0.287,
                        "y": 0.701
                    },
                    {
                        "onCurve": false,
                        "x": 0.287,
                        "y": 0.737
                    },
                    {
                        "onCurve": true,
                        "x": 0.287,
                        "y": 0.794
                    },
                    {
                        "onCurve": false,
                        "x": 0.288,
                        "y": 0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.292,
                        "y": 0.963
                    },
                    {
                        "onCurve": false,
                        "x": 0.293,
                        "y": 0.966
                    },
                    {
                        "onCurve": true,
                        "x": 0.293,
                        "y": 0.967
                    },
                    {
                        "onCurve": false,
                        "x": 0.314,
                        "y": 1.044
                    },
                    {
                        "onCurve": true,
                        "x": 0.406,
                        "y": 1.101
                    },
                    {
                        "onCurve": false,
                        "x": 0.449,
                        "y": 1.126
                    },
                    {
                        "onCurve": true,
                        "x": 0.508,
                        "y": 1.148
                    },
                    {
                        "onCurve": false,
                        "x": 0.516,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.527,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.541,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": 1.144
                    },
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": 1.13
                    },
                    {
                        "onCurve": false,
                        "x": 0.547,
                        "y": 1.117
                    },
                    {
                        "onCurve": false,
                        "x": 0.544,
                        "y": 1.112
                    },
                    {
                        "onCurve": true,
                        "x": 0.536,
                        "y": 1.109
                    },
                    {
                        "onCurve": false,
                        "x": 0.498,
                        "y": 1.094
                    },
                    {
                        "onCurve": true,
                        "x": 0.467,
                        "y": 1.071
                    },
                    {
                        "onCurve": false,
                        "x": 0.396,
                        "y": 1.021
                    },
                    {
                        "onCurve": true,
                        "x": 0.381,
                        "y": 0.95
                    },
                    {
                        "onCurve": true,
                        "x": 0.379,
                        "y": 0.94
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": 0.699
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": 0.657
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": 0.594
                    },
                    {
                        "onCurve": false,
                        "x": 0.377,
                        "y": 0.452
                    },
                    {
                        "onCurve": true,
                        "x": 0.374,
                        "y": 0.438
                    },
                    {
                        "onCurve": false,
                        "x": 0.373,
                        "y": 0.437
                    },
                    {
                        "onCurve": true,
                        "x": 0.373,
                        "y": 0.436
                    },
                    {
                        "onCurve": false,
                        "x": 0.35,
                        "y": 0.348
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": 0.282
                    },
                    {
                        "onCurve": false,
                        "x": 0.192,
                        "y": 0.257
                    },
                    {
                        "onCurve": true,
                        "x": 0.186,
                        "y": 0.254
                    },
                    {
                        "onCurve": true,
                        "x": 0.176,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.188,
                        "y": 0.245
                    },
                    {
                        "onCurve": false,
                        "x": 0.343,
                        "y": 0.183
                    },
                    {
                        "onCurve": true,
                        "x": 0.373,
                        "y": 0.065
                    },
                    {
                        "onCurve": false,
                        "x": 0.373,
                        "y": 0.064
                    },
                    {
                        "onCurve": true,
                        "x": 0.374,
                        "y": 0.063
                    },
                    {
                        "onCurve": false,
                        "x": 0.377,
                        "y": 0.049
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": -0.093
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": -0.156
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": -0.198
                    },
                    {
                        "onCurve": true,
                        "x": 0.379,
                        "y": -0.438
                    },
                    {
                        "onCurve": true,
                        "x": 0.381,
                        "y": -0.449
                    },
                    {
                        "onCurve": false,
                        "x": 0.396,
                        "y": -0.52
                    },
                    {
                        "onCurve": true,
                        "x": 0.467,
                        "y": -0.57
                    },
                    {
                        "onCurve": false,
                        "x": 0.498,
                        "y": -0.593
                    },
                    {
                        "onCurve": true,
                        "x": 0.536,
                        "y": -0.608
                    },
                    {
                        "onCurve": false,
                        "x": 0.544,
                        "y": -0.611
                    },
                    {
                        "onCurve": false,
                        "x": 0.547,
                        "y": -0.616
                    },
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": -0.629
                    }
                ]
            ],
            "advanceWidth": 0.667
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.13,
                "yMin": -0.949,
                "xMax": 0.618,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.618,
                        "y": -0.943
                    },
                    {
                        "onCurve": true,
                        "x": 0.612,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.582,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.568,
                        "y": -0.943
                    },
                    {
                        "onCurve": false,
                        "x": 0.472,
                        "y": -0.903
                    },
                    {
                        "onCurve": false,
                        "x": 0.35,
                        "y": -0.778
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": -0.703
                    },
                    {
                        "onCurve": false,
                        "x": 0.327,
                        "y": -0.682
                    },
                    {
                        "onCurve": false,
                        "x": 0.326,
                        "y": -0.623
                    },
                    {
                        "onCurve": true,
                        "x": 0.325,
                        "y": -0.35
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": -0.028
                    },
                    {
                        "onCurve": true,
                        "x": 0.323,
                        "y": -0.018
                    },
                    {
                        "onCurve": false,
                        "x": 0.311,
                        "y": 0.06
                    },
                    {
                        "onCurve": false,
                        "x": 0.213,
                        "y": 0.189
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 0.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.132,
                        "y": 0.233
                    },
                    {
                        "onCurve": true,
                        "x": 0.131,
                        "y": 0.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.13,
                        "y": 0.24
                    },
                    {
                        "onCurve": false,
                        "x": 0.13,
                        "y": 0.26
                    },
                    {
                        "onCurve": false,
                        "x": 0.132,
                        "y": 0.268
                    },
                    {
                        "onCurve": false,
                        "x": 0.136,
                        "y": 0.271
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 0.275
                    },
                    {
                        "onCurve": false,
                        "x": 0.207,
                        "y": 0.308
                    },
                    {
                        "onCurve": true,
                        "x": 0.256,
                        "y": 0.367
                    },
                    {
                        "onCurve": false,
                        "x": 0.31,
                        "y": 0.436
                    },
                    {
                        "onCurve": true,
                        "x": 0.323,
                        "y": 0.519
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": 0.529
                    },
                    {
                        "onCurve": true,
                        "x": 0.325,
                        "y": 0.851
                    },
                    {
                        "onCurve": false,
                        "x": 0.326,
                        "y": 1.124
                    },
                    {
                        "onCurve": false,
                        "x": 0.327,
                        "y": 1.184
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 1.205
                    },
                    {
                        "onCurve": false,
                        "x": 0.369,
                        "y": 1.358
                    },
                    {
                        "onCurve": true,
                        "x": 0.566,
                        "y": 1.443
                    },
                    {
                        "onCurve": true,
                        "x": 0.582,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.612,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.618,
                        "y": 1.444
                    },
                    {
                        "onCurve": true,
                        "x": 0.618,
                        "y": 1.429
                    },
                    {
                        "onCurve": false,
                        "x": 0.618,
                        "y": 1.413
                    },
                    {
                        "onCurve": true,
                        "x": 0.616,
                        "y": 1.411
                    },
                    {
                        "onCurve": false,
                        "x": 0.616,
                        "y": 1.409
                    },
                    {
                        "onCurve": true,
                        "x": 0.606,
                        "y": 1.405
                    },
                    {
                        "onCurve": false,
                        "x": 0.57,
                        "y": 1.387
                    },
                    {
                        "onCurve": true,
                        "x": 0.544,
                        "y": 1.367
                    },
                    {
                        "onCurve": false,
                        "x": 0.449,
                        "y": 1.294
                    },
                    {
                        "onCurve": true,
                        "x": 0.429,
                        "y": 1.2
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": 1.18
                    },
                    {
                        "onCurve": false,
                        "x": 0.424,
                        "y": 1.124
                    },
                    {
                        "onCurve": true,
                        "x": 0.423,
                        "y": 0.851
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 0.579
                    },
                    {
                        "onCurve": false,
                        "x": 0.421,
                        "y": 0.519
                    },
                    {
                        "onCurve": true,
                        "x": 0.416,
                        "y": 0.498
                    },
                    {
                        "onCurve": false,
                        "x": 0.401,
                        "y": 0.429
                    },
                    {
                        "onCurve": false,
                        "x": 0.3,
                        "y": 0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.221,
                        "y": 0.267
                    },
                    {
                        "onCurve": false,
                        "x": 0.218,
                        "y": 0.265
                    },
                    {
                        "onCurve": false,
                        "x": 0.206,
                        "y": 0.259
                    },
                    {
                        "onCurve": false,
                        "x": 0.199,
                        "y": 0.255
                    },
                    {
                        "onCurve": true,
                        "x": 0.197,
                        "y": 0.254
                    },
                    {
                        "onCurve": true,
                        "x": 0.188,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.205,
                        "y": 0.242
                    },
                    {
                        "onCurve": false,
                        "x": 0.29,
                        "y": 0.2
                    },
                    {
                        "onCurve": false,
                        "x": 0.4,
                        "y": 0.075
                    },
                    {
                        "onCurve": true,
                        "x": 0.416,
                        "y": 0.003
                    },
                    {
                        "onCurve": false,
                        "x": 0.421,
                        "y": -0.018
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.078
                    },
                    {
                        "onCurve": true,
                        "x": 0.423,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.423,
                        "y": -0.397
                    },
                    {
                        "onCurve": true,
                        "x": 0.423,
                        "y": -0.472
                    },
                    {
                        "onCurve": false,
                        "x": 0.424,
                        "y": -0.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.428,
                        "y": -0.694
                    },
                    {
                        "onCurve": false,
                        "x": 0.429,
                        "y": -0.697
                    },
                    {
                        "onCurve": true,
                        "x": 0.429,
                        "y": -0.699
                    },
                    {
                        "onCurve": false,
                        "x": 0.449,
                        "y": -0.793
                    },
                    {
                        "onCurve": true,
                        "x": 0.544,
                        "y": -0.866
                    },
                    {
                        "onCurve": false,
                        "x": 0.57,
                        "y": -0.886
                    },
                    {
                        "onCurve": true,
                        "x": 0.606,
                        "y": -0.904
                    },
                    {
                        "onCurve": false,
                        "x": 0.616,
                        "y": -0.908
                    },
                    {
                        "onCurve": true,
                        "x": 0.616,
                        "y": -0.91
                    },
                    {
                        "onCurve": false,
                        "x": 0.618,
                        "y": -0.912
                    },
                    {
                        "onCurve": true,
                        "x": 0.618,
                        "y": -0.928
                    }
                ]
            ],
            "advanceWidth": 0.75
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.144,
                "yMin": -1.249,
                "xMax": 0.661,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.655,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.622,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.604,
                        "y": -1.24
                    },
                    {
                        "onCurve": false,
                        "x": 0.48,
                        "y": -1.179
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": -1.075
                    },
                    {
                        "onCurve": false,
                        "x": 0.361,
                        "y": -1.001
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": -0.909
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.897
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.499
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": -0.098
                    },
                    {
                        "onCurve": true,
                        "x": 0.343,
                        "y": -0.082
                    },
                    {
                        "onCurve": false,
                        "x": 0.34,
                        "y": -0.052
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": -0.024
                    },
                    {
                        "onCurve": false,
                        "x": 0.313,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.222,
                        "y": 0.181
                    },
                    {
                        "onCurve": true,
                        "x": 0.157,
                        "y": 0.223
                    },
                    {
                        "onCurve": false,
                        "x": 0.155,
                        "y": 0.225
                    },
                    {
                        "onCurve": false,
                        "x": 0.149,
                        "y": 0.229
                    },
                    {
                        "onCurve": false,
                        "x": 0.148,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.145,
                        "y": 0.234
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.239
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.259
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.264
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 0.267
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.149,
                        "y": 0.271
                    },
                    {
                        "onCurve": false,
                        "x": 0.151,
                        "y": 0.273
                    },
                    {
                        "onCurve": false,
                        "x": 0.155,
                        "y": 0.277
                    },
                    {
                        "onCurve": true,
                        "x": 0.157,
                        "y": 0.278
                    },
                    {
                        "onCurve": false,
                        "x": 0.222,
                        "y": 0.32
                    },
                    {
                        "onCurve": false,
                        "x": 0.313,
                        "y": 0.448
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.525
                    },
                    {
                        "onCurve": false,
                        "x": 0.34,
                        "y": 0.553
                    },
                    {
                        "onCurve": true,
                        "x": 0.343,
                        "y": 0.583
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": 0.6
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 1.398
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": 1.41
                    },
                    {
                        "onCurve": false,
                        "x": 0.355,
                        "y": 1.459
                    },
                    {
                        "onCurve": true,
                        "x": 0.371,
                        "y": 1.5
                    },
                    {
                        "onCurve": false,
                        "x": 0.413,
                        "y": 1.61
                    },
                    {
                        "onCurve": true,
                        "x": 0.52,
                        "y": 1.689
                    },
                    {
                        "onCurve": false,
                        "x": 0.553,
                        "y": 1.714
                    },
                    {
                        "onCurve": true,
                        "x": 0.6,
                        "y": 1.739
                    },
                    {
                        "onCurve": true,
                        "x": 0.622,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.655,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.727
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.715
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 1.706
                    },
                    {
                        "onCurve": true,
                        "x": 0.651,
                        "y": 1.702
                    },
                    {
                        "onCurve": false,
                        "x": 0.602,
                        "y": 1.675
                    },
                    {
                        "onCurve": false,
                        "x": 0.519,
                        "y": 1.585
                    },
                    {
                        "onCurve": true,
                        "x": 0.495,
                        "y": 1.533
                    },
                    {
                        "onCurve": false,
                        "x": 0.465,
                        "y": 1.47
                    },
                    {
                        "onCurve": true,
                        "x": 0.459,
                        "y": 1.398
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 1.389
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 0.614
                    },
                    {
                        "onCurve": true,
                        "x": 0.457,
                        "y": 0.605
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": 0.477
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": 0.37
                    },
                    {
                        "onCurve": false,
                        "x": 0.281,
                        "y": 0.29
                    },
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.261,
                        "y": 0.215
                    },
                    {
                        "onCurve": true,
                        "x": 0.301,
                        "y": 0.185
                    },
                    {
                        "onCurve": false,
                        "x": 0.325,
                        "y": 0.165
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": 0.131
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": 0.024
                    },
                    {
                        "onCurve": true,
                        "x": 0.457,
                        "y": -0.104
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.113
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.501
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.888
                    },
                    {
                        "onCurve": true,
                        "x": 0.459,
                        "y": -0.897
                    },
                    {
                        "onCurve": false,
                        "x": 0.469,
                        "y": -1.017
                    },
                    {
                        "onCurve": true,
                        "x": 0.543,
                        "y": -1.108
                    },
                    {
                        "onCurve": false,
                        "x": 0.569,
                        "y": -1.141
                    },
                    {
                        "onCurve": true,
                        "x": 0.602,
                        "y": -1.167
                    },
                    {
                        "onCurve": false,
                        "x": 0.625,
                        "y": -1.187
                    },
                    {
                        "onCurve": true,
                        "x": 0.651,
                        "y": -1.201
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": -1.205
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.214
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.226
                    }
                ]
            ],
            "advanceWidth": 0.806
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.144,
                "yMin": -1.249,
                "xMax": 0.661,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.655,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.622,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.604,
                        "y": -1.24
                    },
                    {
                        "onCurve": false,
                        "x": 0.48,
                        "y": -1.179
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": -1.075
                    },
                    {
                        "onCurve": false,
                        "x": 0.361,
                        "y": -1.001
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": -0.909
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.897
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.499
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.499
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": -0.098
                    },
                    {
                        "onCurve": true,
                        "x": 0.343,
                        "y": -0.082
                    },
                    {
                        "onCurve": false,
                        "x": 0.34,
                        "y": -0.052
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": -0.024
                    },
                    {
                        "onCurve": false,
                        "x": 0.313,
                        "y": 0.053
                    },
                    {
                        "onCurve": false,
                        "x": 0.222,
                        "y": 0.181
                    },
                    {
                        "onCurve": true,
                        "x": 0.157,
                        "y": 0.223
                    },
                    {
                        "onCurve": false,
                        "x": 0.155,
                        "y": 0.225
                    },
                    {
                        "onCurve": false,
                        "x": 0.149,
                        "y": 0.229
                    },
                    {
                        "onCurve": false,
                        "x": 0.148,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.145,
                        "y": 0.234
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.239
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.259
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 0.264
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 0.267
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.149,
                        "y": 0.271
                    },
                    {
                        "onCurve": false,
                        "x": 0.151,
                        "y": 0.273
                    },
                    {
                        "onCurve": false,
                        "x": 0.155,
                        "y": 0.277
                    },
                    {
                        "onCurve": true,
                        "x": 0.157,
                        "y": 0.278
                    },
                    {
                        "onCurve": false,
                        "x": 0.222,
                        "y": 0.32
                    },
                    {
                        "onCurve": false,
                        "x": 0.313,
                        "y": 0.448
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.525
                    },
                    {
                        "onCurve": false,
                        "x": 0.34,
                        "y": 0.553
                    },
                    {
                        "onCurve": true,
                        "x": 0.343,
                        "y": 0.583
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": 0.6
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.001
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 1.398
                    },
                    {
                        "onCurve": true,
                        "x": 0.348,
                        "y": 1.41
                    },
                    {
                        "onCurve": false,
                        "x": 0.355,
                        "y": 1.459
                    },
                    {
                        "onCurve": true,
                        "x": 0.371,
                        "y": 1.5
                    },
                    {
                        "onCurve": false,
                        "x": 0.413,
                        "y": 1.61
                    },
                    {
                        "onCurve": true,
                        "x": 0.52,
                        "y": 1.689
                    },
                    {
                        "onCurve": false,
                        "x": 0.553,
                        "y": 1.714
                    },
                    {
                        "onCurve": true,
                        "x": 0.6,
                        "y": 1.739
                    },
                    {
                        "onCurve": true,
                        "x": 0.622,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.655,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.744
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.727
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": 1.715
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 1.706
                    },
                    {
                        "onCurve": true,
                        "x": 0.651,
                        "y": 1.702
                    },
                    {
                        "onCurve": false,
                        "x": 0.602,
                        "y": 1.675
                    },
                    {
                        "onCurve": false,
                        "x": 0.519,
                        "y": 1.585
                    },
                    {
                        "onCurve": true,
                        "x": 0.495,
                        "y": 1.533
                    },
                    {
                        "onCurve": false,
                        "x": 0.465,
                        "y": 1.47
                    },
                    {
                        "onCurve": true,
                        "x": 0.459,
                        "y": 1.398
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 1.389
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 0.614
                    },
                    {
                        "onCurve": true,
                        "x": 0.457,
                        "y": 0.605
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": 0.477
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": 0.37
                    },
                    {
                        "onCurve": false,
                        "x": 0.281,
                        "y": 0.29
                    },
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.261,
                        "y": 0.215
                    },
                    {
                        "onCurve": true,
                        "x": 0.301,
                        "y": 0.185
                    },
                    {
                        "onCurve": false,
                        "x": 0.325,
                        "y": 0.165
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": 0.131
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": 0.024
                    },
                    {
                        "onCurve": true,
                        "x": 0.457,
                        "y": -0.104
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.113
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.501
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.501
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.888
                    },
                    {
                        "onCurve": true,
                        "x": 0.459,
                        "y": -0.897
                    },
                    {
                        "onCurve": false,
                        "x": 0.469,
                        "y": -1.017
                    },
                    {
                        "onCurve": true,
                        "x": 0.543,
                        "y": -1.108
                    },
                    {
                        "onCurve": false,
                        "x": 0.569,
                        "y": -1.141
                    },
                    {
                        "onCurve": true,
                        "x": 0.602,
                        "y": -1.167
                    },
                    {
                        "onCurve": false,
                        "x": 0.625,
                        "y": -1.187
                    },
                    {
                        "onCurve": true,
                        "x": 0.651,
                        "y": -1.201
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": -1.205
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.214
                    },
                    {
                        "onCurve": true,
                        "x": 0.661,
                        "y": -1.226
                    }
                ]
            ],
            "advanceWidth": 0.806
        }
    ],
    "125": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.065,
                "yMin": -0.25,
                "xMax": 0.434,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.065,
                        "y": 0.731
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": 0.744
                    },
                    {
                        "onCurve": false,
                        "x": 0.069,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.079,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.088,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.168,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.274,
                        "y": 0.696
                    },
                    {
                        "onCurve": true,
                        "x": 0.288,
                        "y": 0.645
                    },
                    {
                        "onCurve": false,
                        "x": 0.291,
                        "y": 0.636
                    },
                    {
                        "onCurve": false,
                        "x": 0.292,
                        "y": 0.365
                    },
                    {
                        "onCurve": true,
                        "x": 0.293,
                        "y": 0.357
                    },
                    {
                        "onCurve": false,
                        "x": 0.303,
                        "y": 0.321
                    },
                    {
                        "onCurve": false,
                        "x": 0.373,
                        "y": 0.269
                    },
                    {
                        "onCurve": true,
                        "x": 0.417,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.428,
                        "y": 0.269
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": 0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.434,
                        "y": 0.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.428,
                        "y": 0.231
                    },
                    {
                        "onCurve": true,
                        "x": 0.417,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.309,
                        "y": 0.187
                    },
                    {
                        "onCurve": true,
                        "x": 0.298,
                        "y": 0.157
                    },
                    {
                        "onCurve": false,
                        "x": 0.293,
                        "y": 0.144
                    },
                    {
                        "onCurve": false,
                        "x": 0.292,
                        "y": 0.117
                    },
                    {
                        "onCurve": true,
                        "x": 0.291,
                        "y": 0
                    },
                    {
                        "onCurve": false,
                        "x": 0.29,
                        "y": -0.138
                    },
                    {
                        "onCurve": true,
                        "x": 0.288,
                        "y": -0.145
                    },
                    {
                        "onCurve": false,
                        "x": 0.28,
                        "y": -0.177
                    },
                    {
                        "onCurve": true,
                        "x": 0.256,
                        "y": -0.198
                    },
                    {
                        "onCurve": false,
                        "x": 0.202,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.089,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.078,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.07,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": -0.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.065,
                        "y": -0.23
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": -0.219
                    },
                    {
                        "onCurve": false,
                        "x": 0.069,
                        "y": -0.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.077,
                        "y": -0.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": -0.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.197,
                        "y": -0.171
                    },
                    {
                        "onCurve": true,
                        "x": 0.207,
                        "y": -0.139
                    },
                    {
                        "onCurve": false,
                        "x": 0.208,
                        "y": -0.134
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0.003
                    },
                    {
                        "onCurve": true,
                        "x": 0.21,
                        "y": 0.139
                    },
                    {
                        "onCurve": false,
                        "x": 0.23,
                        "y": 0.223
                    },
                    {
                        "onCurve": true,
                        "x": 0.33,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.297,
                        "y": 0.261
                    },
                    {
                        "onCurve": true,
                        "x": 0.28,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.225,
                        "y": 0.303
                    },
                    {
                        "onCurve": true,
                        "x": 0.212,
                        "y": 0.352
                    },
                    {
                        "onCurve": true,
                        "x": 0.21,
                        "y": 0.362
                    },
                    {
                        "onCurve": true,
                        "x": 0.209,
                        "y": 0.498
                    },
                    {
                        "onCurve": false,
                        "x": 0.208,
                        "y": 0.635
                    },
                    {
                        "onCurve": true,
                        "x": 0.207,
                        "y": 0.64
                    },
                    {
                        "onCurve": false,
                        "x": 0.197,
                        "y": 0.672
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": 0.713
                    },
                    {
                        "onCurve": true,
                        "x": 0.077,
                        "y": 0.713
                    },
                    {
                        "onCurve": false,
                        "x": 0.069,
                        "y": 0.713
                    },
                    {
                        "onCurve": false,
                        "x": 0.065,
                        "y": 0.719
                    }
                ]
            ],
            "advanceWidth": 0.5
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.105,
                "yMin": -0.349,
                "xMax": 0.477,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.11,
                        "y": 0.849
                    },
                    {
                        "onCurve": true,
                        "x": 0.115,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.12,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.125,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.138,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.175,
                        "y": 0.839
                    },
                    {
                        "onCurve": false,
                        "x": 0.273,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": 0.764
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": 0.747
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.714
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.552
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.528
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.489
                    },
                    {
                        "onCurve": false,
                        "x": 0.334,
                        "y": 0.383
                    },
                    {
                        "onCurve": true,
                        "x": 0.338,
                        "y": 0.373
                    },
                    {
                        "onCurve": false,
                        "x": 0.339,
                        "y": 0.372
                    },
                    {
                        "onCurve": true,
                        "x": 0.339,
                        "y": 0.371
                    },
                    {
                        "onCurve": false,
                        "x": 0.351,
                        "y": 0.34
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": 0.284
                    },
                    {
                        "onCurve": true,
                        "x": 0.469,
                        "y": 0.271
                    },
                    {
                        "onCurve": false,
                        "x": 0.477,
                        "y": 0.268
                    },
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.477,
                        "y": 0.233
                    },
                    {
                        "onCurve": true,
                        "x": 0.469,
                        "y": 0.23
                    },
                    {
                        "onCurve": false,
                        "x": 0.425,
                        "y": 0.217
                    },
                    {
                        "onCurve": false,
                        "x": 0.351,
                        "y": 0.161
                    },
                    {
                        "onCurve": true,
                        "x": 0.339,
                        "y": 0.13
                    },
                    {
                        "onCurve": false,
                        "x": 0.339,
                        "y": 0.129
                    },
                    {
                        "onCurve": true,
                        "x": 0.338,
                        "y": 0.128
                    },
                    {
                        "onCurve": false,
                        "x": 0.334,
                        "y": 0.117
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.032
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.026
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.012
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": -0.027
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -0.051
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": -0.212
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": -0.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": -0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.273,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.175,
                        "y": -0.338
                    },
                    {
                        "onCurve": false,
                        "x": 0.139,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.111,
                        "y": -0.349
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": -0.343
                    },
                    {
                        "onCurve": true,
                        "x": 0.105,
                        "y": -0.329
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": -0.316
                    },
                    {
                        "onCurve": true,
                        "x": 0.106,
                        "y": -0.314
                    },
                    {
                        "onCurve": false,
                        "x": 0.109,
                        "y": -0.31
                    },
                    {
                        "onCurve": true,
                        "x": 0.13,
                        "y": -0.304
                    },
                    {
                        "onCurve": false,
                        "x": 0.192,
                        "y": -0.284
                    },
                    {
                        "onCurve": true,
                        "x": 0.222,
                        "y": -0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.242,
                        "y": -0.234
                    },
                    {
                        "onCurve": true,
                        "x": 0.248,
                        "y": -0.209
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": -0.203
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": -0.049
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": 0.106
                    },
                    {
                        "onCurve": true,
                        "x": 0.25,
                        "y": 0.112
                    },
                    {
                        "onCurve": false,
                        "x": 0.255,
                        "y": 0.14
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": 0.167
                    },
                    {
                        "onCurve": false,
                        "x": 0.307,
                        "y": 0.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.398,
                        "y": 0.245
                    },
                    {
                        "onCurve": true,
                        "x": 0.413,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.401,
                        "y": 0.255
                    },
                    {
                        "onCurve": false,
                        "x": 0.309,
                        "y": 0.286
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": 0.334
                    },
                    {
                        "onCurve": false,
                        "x": 0.255,
                        "y": 0.361
                    },
                    {
                        "onCurve": true,
                        "x": 0.25,
                        "y": 0.389
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": 0.395
                    },
                    {
                        "onCurve": true,
                        "x": 0.249,
                        "y": 0.55
                    },
                    {
                        "onCurve": false,
                        "x": 0.249,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.244,
                        "y": 0.724
                    },
                    {
                        "onCurve": false,
                        "x": 0.224,
                        "y": 0.774
                    },
                    {
                        "onCurve": true,
                        "x": 0.13,
                        "y": 0.805
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": 0.806
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": 0.808
                    },
                    {
                        "onCurve": false,
                        "x": 0.113,
                        "y": 0.811
                    },
                    {
                        "onCurve": true,
                        "x": 0.112,
                        "y": 0.811
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": 0.813
                    },
                    {
                        "onCurve": true,
                        "x": 0.105,
                        "y": 0.83
                    },
                    {
                        "onCurve": false,
                        "x": 0.105,
                        "y": 0.845
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.119,
                "yMin": -0.649,
                "xMax": 0.547,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": 1.13
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": 1.145
                    },
                    {
                        "onCurve": false,
                        "x": 0.124,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.139,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.165,
                        "y": 1.145
                    },
                    {
                        "onCurve": false,
                        "x": 0.227,
                        "y": 1.123
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": 1.092
                    },
                    {
                        "onCurve": false,
                        "x": 0.354,
                        "y": 1.037
                    },
                    {
                        "onCurve": true,
                        "x": 0.373,
                        "y": 0.964
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": 0.942
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": 0.702
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": 0.469
                    },
                    {
                        "onCurve": true,
                        "x": 0.379,
                        "y": 0.462
                    },
                    {
                        "onCurve": false,
                        "x": 0.386,
                        "y": 0.394
                    },
                    {
                        "onCurve": true,
                        "x": 0.439,
                        "y": 0.339
                    },
                    {
                        "onCurve": false,
                        "x": 0.482,
                        "y": 0.296
                    },
                    {
                        "onCurve": true,
                        "x": 0.535,
                        "y": 0.272
                    },
                    {
                        "onCurve": false,
                        "x": 0.544,
                        "y": 0.268
                    },
                    {
                        "onCurve": false,
                        "x": 0.547,
                        "y": 0.263
                    },
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.547,
                        "y": 0.238
                    },
                    {
                        "onCurve": false,
                        "x": 0.544,
                        "y": 0.233
                    },
                    {
                        "onCurve": true,
                        "x": 0.535,
                        "y": 0.229
                    },
                    {
                        "onCurve": false,
                        "x": 0.503,
                        "y": 0.214
                    },
                    {
                        "onCurve": true,
                        "x": 0.477,
                        "y": 0.194
                    },
                    {
                        "onCurve": false,
                        "x": 0.39,
                        "y": 0.129
                    },
                    {
                        "onCurve": true,
                        "x": 0.379,
                        "y": 0.039
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": 0.032
                    },
                    {
                        "onCurve": true,
                        "x": 0.378,
                        "y": -0.201
                    },
                    {
                        "onCurve": false,
                        "x": 0.378,
                        "y": -0.441
                    },
                    {
                        "onCurve": true,
                        "x": 0.373,
                        "y": -0.463
                    },
                    {
                        "onCurve": false,
                        "x": 0.354,
                        "y": -0.536
                    },
                    {
                        "onCurve": true,
                        "x": 0.273,
                        "y": -0.591
                    },
                    {
                        "onCurve": false,
                        "x": 0.227,
                        "y": -0.622
                    },
                    {
                        "onCurve": true,
                        "x": 0.165,
                        "y": -0.644
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.139,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.125,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": -0.643
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": -0.629
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": -0.62
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": -0.611
                    },
                    {
                        "onCurve": false,
                        "x": 0.127,
                        "y": -0.608
                    },
                    {
                        "onCurve": false,
                        "x": 0.139,
                        "y": -0.604
                    },
                    {
                        "onCurve": true,
                        "x": 0.143,
                        "y": -0.602
                    },
                    {
                        "onCurve": false,
                        "x": 0.195,
                        "y": -0.579
                    },
                    {
                        "onCurve": false,
                        "x": 0.275,
                        "y": -0.498
                    },
                    {
                        "onCurve": true,
                        "x": 0.285,
                        "y": -0.447
                    },
                    {
                        "onCurve": false,
                        "x": 0.286,
                        "y": -0.435
                    },
                    {
                        "onCurve": false,
                        "x": 0.288,
                        "y": 0.038
                    },
                    {
                        "onCurve": true,
                        "x": 0.289,
                        "y": 0.051
                    },
                    {
                        "onCurve": false,
                        "x": 0.301,
                        "y": 0.101
                    },
                    {
                        "onCurve": false,
                        "x": 0.347,
                        "y": 0.166
                    },
                    {
                        "onCurve": true,
                        "x": 0.39,
                        "y": 0.197
                    },
                    {
                        "onCurve": false,
                        "x": 0.431,
                        "y": 0.227
                    },
                    {
                        "onCurve": true,
                        "x": 0.478,
                        "y": 0.246
                    },
                    {
                        "onCurve": true,
                        "x": 0.489,
                        "y": 0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.48,
                        "y": 0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.366,
                        "y": 0.303
                    },
                    {
                        "onCurve": true,
                        "x": 0.321,
                        "y": 0.374
                    },
                    {
                        "onCurve": false,
                        "x": 0.302,
                        "y": 0.402
                    },
                    {
                        "onCurve": true,
                        "x": 0.293,
                        "y": 0.434
                    },
                    {
                        "onCurve": false,
                        "x": 0.289,
                        "y": 0.451
                    },
                    {
                        "onCurve": false,
                        "x": 0.288,
                        "y": 0.493
                    },
                    {
                        "onCurve": true,
                        "x": 0.287,
                        "y": 0.699
                    },
                    {
                        "onCurve": false,
                        "x": 0.286,
                        "y": 0.941
                    },
                    {
                        "onCurve": true,
                        "x": 0.285,
                        "y": 0.948
                    },
                    {
                        "onCurve": false,
                        "x": 0.275,
                        "y": 0.999
                    },
                    {
                        "onCurve": false,
                        "x": 0.195,
                        "y": 1.08
                    },
                    {
                        "onCurve": true,
                        "x": 0.143,
                        "y": 1.103
                    },
                    {
                        "onCurve": false,
                        "x": 0.139,
                        "y": 1.105
                    },
                    {
                        "onCurve": false,
                        "x": 0.127,
                        "y": 1.109
                    },
                    {
                        "onCurve": false,
                        "x": 0.123,
                        "y": 1.112
                    },
                    {
                        "onCurve": false,
                        "x": 0.119,
                        "y": 1.121
                    }
                ]
            ],
            "advanceWidth": 0.667
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.131,
                "yMin": -0.949,
                "xMax": 0.618,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": 1.414
                    },
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": 1.444
                    },
                    {
                        "onCurve": false,
                        "x": 0.136,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.148,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.167,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.182,
                        "y": 1.444
                    },
                    {
                        "onCurve": false,
                        "x": 0.276,
                        "y": 1.404
                    },
                    {
                        "onCurve": false,
                        "x": 0.397,
                        "y": 1.281
                    },
                    {
                        "onCurve": true,
                        "x": 0.415,
                        "y": 1.207
                    },
                    {
                        "onCurve": false,
                        "x": 0.421,
                        "y": 1.184
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 1.123
                    },
                    {
                        "onCurve": true,
                        "x": 0.423,
                        "y": 0.851
                    },
                    {
                        "onCurve": true,
                        "x": 0.424,
                        "y": 0.531
                    },
                    {
                        "onCurve": true,
                        "x": 0.426,
                        "y": 0.517
                    },
                    {
                        "onCurve": false,
                        "x": 0.443,
                        "y": 0.399
                    },
                    {
                        "onCurve": true,
                        "x": 0.547,
                        "y": 0.313
                    },
                    {
                        "onCurve": false,
                        "x": 0.584,
                        "y": 0.285
                    },
                    {
                        "onCurve": true,
                        "x": 0.608,
                        "y": 0.274
                    },
                    {
                        "onCurve": false,
                        "x": 0.615,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.618,
                        "y": 0.264
                    },
                    {
                        "onCurve": true,
                        "x": 0.618,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.618,
                        "y": 0.241
                    },
                    {
                        "onCurve": false,
                        "x": 0.617,
                        "y": 0.234
                    },
                    {
                        "onCurve": false,
                        "x": 0.613,
                        "y": 0.23
                    },
                    {
                        "onCurve": true,
                        "x": 0.608,
                        "y": 0.227
                    },
                    {
                        "onCurve": false,
                        "x": 0.55,
                        "y": 0.198
                    },
                    {
                        "onCurve": true,
                        "x": 0.508,
                        "y": 0.151
                    },
                    {
                        "onCurve": false,
                        "x": 0.441,
                        "y": 0.078
                    },
                    {
                        "onCurve": true,
                        "x": 0.426,
                        "y": -0.015
                    },
                    {
                        "onCurve": true,
                        "x": 0.424,
                        "y": -0.029
                    },
                    {
                        "onCurve": true,
                        "x": 0.423,
                        "y": -0.35
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.622
                    },
                    {
                        "onCurve": false,
                        "x": 0.421,
                        "y": -0.683
                    },
                    {
                        "onCurve": true,
                        "x": 0.415,
                        "y": -0.706
                    },
                    {
                        "onCurve": false,
                        "x": 0.397,
                        "y": -0.78
                    },
                    {
                        "onCurve": false,
                        "x": 0.276,
                        "y": -0.903
                    },
                    {
                        "onCurve": true,
                        "x": 0.182,
                        "y": -0.943
                    },
                    {
                        "onCurve": true,
                        "x": 0.167,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": -0.949
                    },
                    {
                        "onCurve": false,
                        "x": 0.137,
                        "y": -0.949
                    },
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": -0.945
                    },
                    {
                        "onCurve": true,
                        "x": 0.131,
                        "y": -0.935
                    },
                    {
                        "onCurve": true,
                        "x": 0.131,
                        "y": -0.928
                    },
                    {
                        "onCurve": true,
                        "x": 0.131,
                        "y": -0.922
                    },
                    {
                        "onCurve": false,
                        "x": 0.131,
                        "y": -0.913
                    },
                    {
                        "onCurve": false,
                        "x": 0.135,
                        "y": -0.907
                    },
                    {
                        "onCurve": true,
                        "x": 0.142,
                        "y": -0.904
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": -0.903
                    },
                    {
                        "onCurve": true,
                        "x": 0.148,
                        "y": -0.902
                    },
                    {
                        "onCurve": false,
                        "x": 0.298,
                        "y": -0.82
                    },
                    {
                        "onCurve": true,
                        "x": 0.323,
                        "y": -0.68
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": -0.663
                    },
                    {
                        "onCurve": false,
                        "x": 0.326,
                        "y": -0.035
                    },
                    {
                        "onCurve": true,
                        "x": 0.327,
                        "y": -0.019
                    },
                    {
                        "onCurve": false,
                        "x": 0.34,
                        "y": 0.06
                    },
                    {
                        "onCurve": true,
                        "x": 0.392,
                        "y": 0.125
                    },
                    {
                        "onCurve": false,
                        "x": 0.415,
                        "y": 0.154
                    },
                    {
                        "onCurve": true,
                        "x": 0.452,
                        "y": 0.184
                    },
                    {
                        "onCurve": false,
                        "x": 0.493,
                        "y": 0.216
                    },
                    {
                        "onCurve": true,
                        "x": 0.541,
                        "y": 0.241
                    },
                    {
                        "onCurve": true,
                        "x": 0.561,
                        "y": 0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.541,
                        "y": 0.26
                    },
                    {
                        "onCurve": false,
                        "x": 0.354,
                        "y": 0.357
                    },
                    {
                        "onCurve": true,
                        "x": 0.327,
                        "y": 0.52
                    },
                    {
                        "onCurve": false,
                        "x": 0.326,
                        "y": 0.537
                    },
                    {
                        "onCurve": false,
                        "x": 0.324,
                        "y": 1.164
                    },
                    {
                        "onCurve": true,
                        "x": 0.323,
                        "y": 1.181
                    },
                    {
                        "onCurve": false,
                        "x": 0.298,
                        "y": 1.321
                    },
                    {
                        "onCurve": true,
                        "x": 0.148,
                        "y": 1.403
                    },
                    {
                        "onCurve": false,
                        "x": 0.134,
                        "y": 1.409
                    },
                    {
                        "onCurve": true,
                        "x": 0.132,
                        "y": 1.413
                    }
                ]
            ],
            "advanceWidth": 0.75
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.144,
                "yMin": -1.249,
                "xMax": 0.661,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 1.727
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 1.743
                    },
                    {
                        "onCurve": false,
                        "x": 0.147,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.156,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.167,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.183,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": 1.74
                    },
                    {
                        "onCurve": false,
                        "x": 0.247,
                        "y": 1.718
                    },
                    {
                        "onCurve": true,
                        "x": 0.285,
                        "y": 1.689
                    },
                    {
                        "onCurve": false,
                        "x": 0.414,
                        "y": 1.593
                    },
                    {
                        "onCurve": true,
                        "x": 0.447,
                        "y": 1.456
                    },
                    {
                        "onCurve": false,
                        "x": 0.453,
                        "y": 1.436
                    },
                    {
                        "onCurve": true,
                        "x": 0.456,
                        "y": 1.41
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 1.398
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.459,
                        "y": 0.661
                    },
                    {
                        "onCurve": false,
                        "x": 0.46,
                        "y": 0.587
                    },
                    {
                        "onCurve": true,
                        "x": 0.465,
                        "y": 0.558
                    },
                    {
                        "onCurve": false,
                        "x": 0.479,
                        "y": 0.471
                    },
                    {
                        "onCurve": false,
                        "x": 0.577,
                        "y": 0.322
                    },
                    {
                        "onCurve": true,
                        "x": 0.649,
                        "y": 0.277
                    },
                    {
                        "onCurve": false,
                        "x": 0.651,
                        "y": 0.275
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.659,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.258
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.242
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.659,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.652,
                        "y": 0.226
                    },
                    {
                        "onCurve": true,
                        "x": 0.649,
                        "y": 0.224
                    },
                    {
                        "onCurve": false,
                        "x": 0.577,
                        "y": 0.179
                    },
                    {
                        "onCurve": false,
                        "x": 0.479,
                        "y": 0.03
                    },
                    {
                        "onCurve": true,
                        "x": 0.465,
                        "y": -0.057
                    },
                    {
                        "onCurve": false,
                        "x": 0.46,
                        "y": -0.086
                    },
                    {
                        "onCurve": false,
                        "x": 0.459,
                        "y": -0.16
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.499
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.897
                    },
                    {
                        "onCurve": true,
                        "x": 0.456,
                        "y": -0.909
                    },
                    {
                        "onCurve": false,
                        "x": 0.453,
                        "y": -0.935
                    },
                    {
                        "onCurve": true,
                        "x": 0.447,
                        "y": -0.955
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -1.062
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -1.147
                    },
                    {
                        "onCurve": false,
                        "x": 0.278,
                        "y": -1.201
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": -1.239
                    },
                    {
                        "onCurve": true,
                        "x": 0.183,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.168,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.15,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": -1.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": -1.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.147,
                        "y": -1.206
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": -1.202
                    },
                    {
                        "onCurve": false,
                        "x": 0.204,
                        "y": -1.173
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": -1.129
                    },
                    {
                        "onCurve": false,
                        "x": 0.334,
                        "y": -1.03
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": -0.897
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.888
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.501
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.113
                    },
                    {
                        "onCurve": true,
                        "x": 0.347,
                        "y": -0.104
                    },
                    {
                        "onCurve": false,
                        "x": 0.356,
                        "y": 0.019
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.124
                    },
                    {
                        "onCurve": false,
                        "x": 0.464,
                        "y": 0.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.503,
                        "y": 0.184
                    },
                    {
                        "onCurve": false,
                        "x": 0.556,
                        "y": 0.227
                    },
                    {
                        "onCurve": true,
                        "x": 0.603,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": 0.274
                    },
                    {
                        "onCurve": true,
                        "x": 0.503,
                        "y": 0.317
                    },
                    {
                        "onCurve": false,
                        "x": 0.464,
                        "y": 0.351
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.377
                    },
                    {
                        "onCurve": false,
                        "x": 0.356,
                        "y": 0.482
                    },
                    {
                        "onCurve": true,
                        "x": 0.347,
                        "y": 0.605
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 0.614
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.002
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 1.389
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": 1.398
                    },
                    {
                        "onCurve": false,
                        "x": 0.338,
                        "y": 1.497
                    },
                    {
                        "onCurve": false,
                        "x": 0.232,
                        "y": 1.656
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": 1.703
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 1.707
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 1.713
                    }
                ]
            ],
            "advanceWidth": 0.806
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.144,
                "yMin": -1.249,
                "xMax": 0.661,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": 1.727
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 1.743
                    },
                    {
                        "onCurve": false,
                        "x": 0.147,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.156,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.167,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.183,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": 1.74
                    },
                    {
                        "onCurve": false,
                        "x": 0.247,
                        "y": 1.718
                    },
                    {
                        "onCurve": true,
                        "x": 0.285,
                        "y": 1.689
                    },
                    {
                        "onCurve": false,
                        "x": 0.414,
                        "y": 1.593
                    },
                    {
                        "onCurve": true,
                        "x": 0.447,
                        "y": 1.456
                    },
                    {
                        "onCurve": false,
                        "x": 0.453,
                        "y": 1.436
                    },
                    {
                        "onCurve": true,
                        "x": 0.456,
                        "y": 1.41
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": 1.398
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": 1.001
                    },
                    {
                        "onCurve": false,
                        "x": 0.459,
                        "y": 0.661
                    },
                    {
                        "onCurve": false,
                        "x": 0.46,
                        "y": 0.587
                    },
                    {
                        "onCurve": true,
                        "x": 0.465,
                        "y": 0.558
                    },
                    {
                        "onCurve": false,
                        "x": 0.479,
                        "y": 0.471
                    },
                    {
                        "onCurve": false,
                        "x": 0.577,
                        "y": 0.322
                    },
                    {
                        "onCurve": true,
                        "x": 0.649,
                        "y": 0.277
                    },
                    {
                        "onCurve": false,
                        "x": 0.651,
                        "y": 0.275
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.659,
                        "y": 0.27
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.263
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.258
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.242
                    },
                    {
                        "onCurve": false,
                        "x": 0.661,
                        "y": 0.237
                    },
                    {
                        "onCurve": false,
                        "x": 0.659,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 0.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.652,
                        "y": 0.226
                    },
                    {
                        "onCurve": true,
                        "x": 0.649,
                        "y": 0.224
                    },
                    {
                        "onCurve": false,
                        "x": 0.577,
                        "y": 0.179
                    },
                    {
                        "onCurve": false,
                        "x": 0.479,
                        "y": 0.03
                    },
                    {
                        "onCurve": true,
                        "x": 0.465,
                        "y": -0.057
                    },
                    {
                        "onCurve": false,
                        "x": 0.46,
                        "y": -0.086
                    },
                    {
                        "onCurve": false,
                        "x": 0.459,
                        "y": -0.16
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.499
                    },
                    {
                        "onCurve": true,
                        "x": 0.458,
                        "y": -0.499
                    },
                    {
                        "onCurve": false,
                        "x": 0.458,
                        "y": -0.897
                    },
                    {
                        "onCurve": true,
                        "x": 0.456,
                        "y": -0.909
                    },
                    {
                        "onCurve": false,
                        "x": 0.453,
                        "y": -0.935
                    },
                    {
                        "onCurve": true,
                        "x": 0.447,
                        "y": -0.955
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -1.062
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -1.147
                    },
                    {
                        "onCurve": false,
                        "x": 0.278,
                        "y": -1.201
                    },
                    {
                        "onCurve": true,
                        "x": 0.203,
                        "y": -1.239
                    },
                    {
                        "onCurve": true,
                        "x": 0.183,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.168,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.15,
                        "y": -1.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": -1.243
                    },
                    {
                        "onCurve": true,
                        "x": 0.144,
                        "y": -1.226
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": -1.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.147,
                        "y": -1.206
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": -1.202
                    },
                    {
                        "onCurve": false,
                        "x": 0.204,
                        "y": -1.173
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": -1.129
                    },
                    {
                        "onCurve": false,
                        "x": 0.334,
                        "y": -1.03
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": -0.897
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.888
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.501
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": -0.501
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": -0.113
                    },
                    {
                        "onCurve": true,
                        "x": 0.347,
                        "y": -0.104
                    },
                    {
                        "onCurve": false,
                        "x": 0.356,
                        "y": 0.019
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.124
                    },
                    {
                        "onCurve": false,
                        "x": 0.464,
                        "y": 0.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.503,
                        "y": 0.184
                    },
                    {
                        "onCurve": false,
                        "x": 0.556,
                        "y": 0.227
                    },
                    {
                        "onCurve": true,
                        "x": 0.603,
                        "y": 0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.554,
                        "y": 0.274
                    },
                    {
                        "onCurve": true,
                        "x": 0.503,
                        "y": 0.317
                    },
                    {
                        "onCurve": false,
                        "x": 0.464,
                        "y": 0.351
                    },
                    {
                        "onCurve": true,
                        "x": 0.443,
                        "y": 0.377
                    },
                    {
                        "onCurve": false,
                        "x": 0.356,
                        "y": 0.482
                    },
                    {
                        "onCurve": true,
                        "x": 0.347,
                        "y": 0.605
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 0.614
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.002
                    },
                    {
                        "onCurve": true,
                        "x": 0.346,
                        "y": 1.002
                    },
                    {
                        "onCurve": false,
                        "x": 0.346,
                        "y": 1.389
                    },
                    {
                        "onCurve": true,
                        "x": 0.345,
                        "y": 1.398
                    },
                    {
                        "onCurve": false,
                        "x": 0.338,
                        "y": 1.497
                    },
                    {
                        "onCurve": false,
                        "x": 0.232,
                        "y": 1.656
                    },
                    {
                        "onCurve": true,
                        "x": 0.153,
                        "y": 1.703
                    },
                    {
                        "onCurve": false,
                        "x": 0.146,
                        "y": 1.707
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": 1.713
                    }
                ]
            ],
            "advanceWidth": 0.806
        }
	],
	
    "8739": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.119,
                "yMin": -0.249,
                "xMax": 0.159,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": -0.249
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": -0.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": -0.235
                    },
                    {
                        "onCurve": true,
                        "x": 0.119,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.12,
                        "y": 0.737
                    },
                    {
                        "onCurve": false,
                        "x": 0.13,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.139,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.159,
                        "y": 0.735
                    },
                    {
                        "onCurve": true,
                        "x": 0.159,
                        "y": -0.235
                    }
                ]
            ],
            "advanceWidth": 0.278
		},
		/*{
			"fontId": "Size1-Regular",
			"bbox": {
				"xMin": 0.145,
				"yMin": -0.015,
				"xMax": 0.188,
				"yMax": 0.627
			},
			"contours": [
				[
					{
						"onCurve": true,
						"x": 0.146,
						"y": 0.612
					},
					{
						"onCurve": false,
						"x": 0.15,
						"y": 0.627
					},
					{
						"onCurve": false,
						"x": 0.182,
						"y": 0.627
					},
					{
						"onCurve": true,
						"x": 0.187,
						"y": 0.612
					},
					{
						"onCurve": false,
						"x": 0.188,
						"y": 0.61
					},
					{
						"onCurve": false,
						"x": 0.188,
						"y": 0.002
					},
					{
						"onCurve": true,
						"x": 0.187,
						"y": 0
					},
					{
						"onCurve": false,
						"x": 0.184,
						"y": -0.015
					},
					{
						"onCurve": true,
						"x": 0.166,
						"y": -0.015
					},
					{
						"onCurve": false,
						"x": 0.149,
						"y": -0.015
					},
					{
						"onCurve": true,
						"x": 0.146,
						"y": 0
					},
					{
						"onCurve": true,
						"x": 0.146,
						"y": 0.01
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.019
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.052
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.095
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.15
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.208
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.275
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.337
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.404
					},
					{
						"onCurve": false,
						"x": 0.145,
						"y": 0.462
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.517
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.56
					},
					{
						"onCurve": false,
						"x": 0.146,
						"y": 0.593
					},
					{
						"onCurve": true,
						"x": 0.146,
						"y": 0.602
					}
				]
			]
		},
		{
			"fontId": "Size2-Regular",
			"bbox": {
				"xMin": 0.05,
				"yMin": 0,
				"xMax": 0.2,
				"yMax": 0.533
			},
			"contours": [
				[
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0
					},
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0
					}
				],
				[
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.483
					},
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.483
					}
				]
			]
		},
		{
			"fontId": "Size3-Regular",
			"bbox": {
				"xMin": 0.05,
				"yMin": 0,
				"xMax": 0.2,
				"yMax": 0.533
			},
			"contours": [
				[
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0
					},
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0
					}
				],
				[
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.483
					},
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.483
					}
				]
			]
		},
		{
			"fontId": "Size4-Regular",
			"bbox": {
				"xMin": 0.05,
				"yMin": 0,
				"xMax": 0.2,
				"yMax": 0.533
			},
			"contours": [
				[
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0
					},
					{
						"onCurve": true,
						"x": 0.05,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0.533
					},
					{
						"onCurve": true,
						"x": 0.2,
						"y": 0
					}
				],
				[
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.05
					},
					{
						"onCurve": true,
						"x": 0.15,
						"y": 0.483
					},
					{
						"onCurve": true,
						"x": 0.1,
						"y": 0.483
					}
				]
			]
		}*/
	],
	
    "8968": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.174,
                "yMin": -0.25,
                "xMax": 0.422,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": 0.734
                    },
                    {
                        "onCurve": false,
                        "x": 0.178,
                        "y": 0.746
                    },
                    {
                        "onCurve": true,
                        "x": 0.19,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.298,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.406,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": 0.748
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 0.742
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": 0.718
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": 0.712
                    },
                    {
                        "onCurve": false,
                        "x": 0.406,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.31,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": -0.235
                    },
                    {
                        "onCurve": false,
                        "x": 0.207,
                        "y": -0.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.196,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.184,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": -0.234
                    }
                ]
            ],
            "advanceWidth": 0.444
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.202,
                "yMin": -0.349,
                "xMax": 0.449,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.449,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.449,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": -0.349
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.224,
                "yMin": -0.649,
                "xMax": 0.511,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.511,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.511,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": -0.649
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.246,
                "yMin": -0.949,
                "xMax": 0.571,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.246,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.246,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.571,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.571,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.308,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.308,
                        "y": -0.949
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.269,
                "yMin": -1.249,
                "xMax": 0.633,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.633,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.633,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": -1.249
                    }
                ]
            ],
            "advanceWidth": 0.639
        }
    ],
    "8969": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.021,
                "yMin": -0.25,
                "xMax": 0.269,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -0.235
                    },
                    {
                        "onCurve": false,
                        "x": 0.262,
                        "y": -0.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.251,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.239,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": -0.234
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": 0.71
                    },
                    {
                        "onCurve": false,
                        "x": 0.037,
                        "y": 0.71
                    },
                    {
                        "onCurve": true,
                        "x": 0.034,
                        "y": 0.712
                    },
                    {
                        "onCurve": false,
                        "x": 0.021,
                        "y": 0.718
                    },
                    {
                        "onCurve": false,
                        "x": 0.021,
                        "y": 0.742
                    },
                    {
                        "onCurve": true,
                        "x": 0.034,
                        "y": 0.748
                    },
                    {
                        "onCurve": false,
                        "x": 0.037,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.147,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.256,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.266,
                        "y": 0.742
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 0.735
                    }
                ]
            ],
            "advanceWidth": 0.444
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.022,
                "yMin": -0.349,
                "xMax": 0.269,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.81
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": 0.81
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.016,
                "yMin": -0.649,
                "xMax": 0.303,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": 1.099
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.303,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.303,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.252,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.252,
                        "y": 1.099
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.011,
                "yMin": -0.949,
                "xMax": 0.336,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": 1.388
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.336,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.336,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": 1.388
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.005,
                "yMin": -1.249,
                "xMax": 0.369,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": 1.677
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.369,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.369,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": 1.677
                    }
                ]
            ],
            "advanceWidth": 0.639
        }
	],
	
    "8970": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.174,
                "yMin": -0.25,
                "xMax": 0.422,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.19,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.178,
                        "y": -0.246
                    },
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": -0.234
                    },
                    {
                        "onCurve": true,
                        "x": 0.174,
                        "y": 0.734
                    },
                    {
                        "onCurve": false,
                        "x": 0.184,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.196,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.207,
                        "y": 0.749
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": 0.735
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.31,
                        "y": -0.21
                    },
                    {
                        "onCurve": false,
                        "x": 0.406,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": -0.212
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.218
                    },
                    {
                        "onCurve": false,
                        "x": 0.422,
                        "y": -0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.41,
                        "y": -0.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.406,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.298,
                        "y": -0.25
                    }
                ]
            ],
            "advanceWidth": 0.444
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.202,
                "yMin": -0.349,
                "xMax": 0.449,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.202,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.242,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.449,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.449,
                        "y": -0.349
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.224,
                "yMin": -0.649,
                "xMax": 0.511,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.224,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.275,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.511,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.511,
                        "y": -0.649
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.246,
                "yMin": -0.949,
                "xMax": 0.571,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.246,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.246,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.308,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.308,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.571,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.571,
                        "y": -0.949
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.269,
                "yMin": -1.249,
                "xMax": 0.633,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.342,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.633,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.633,
                        "y": -1.249
                    }
                ]
            ],
            "advanceWidth": 0.639
        }
    ],
    "8971": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.021,
                "yMin": -0.25,
                "xMax": 0.269,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.251,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.262,
                        "y": 0.749
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 0.735
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -0.235
                    },
                    {
                        "onCurve": false,
                        "x": 0.267,
                        "y": -0.24
                    },
                    {
                        "onCurve": true,
                        "x": 0.256,
                        "y": -0.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.147,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.059,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.032,
                        "y": -0.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.027,
                        "y": -0.244
                    },
                    {
                        "onCurve": false,
                        "x": 0.021,
                        "y": -0.238
                    },
                    {
                        "onCurve": true,
                        "x": 0.021,
                        "y": -0.23
                    },
                    {
                        "onCurve": false,
                        "x": 0.021,
                        "y": -0.218
                    },
                    {
                        "onCurve": true,
                        "x": 0.034,
                        "y": -0.212
                    },
                    {
                        "onCurve": false,
                        "x": 0.037,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": -0.21
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": 0.734
                    },
                    {
                        "onCurve": false,
                        "x": 0.239,
                        "y": 0.75
                    }
                ]
            ],
            "advanceWidth": 0.444
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.022,
                "yMin": -0.349,
                "xMax": 0.269,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": -0.309
                    },
                    {
                        "onCurve": true,
                        "x": 0.229,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.269,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.349
                    },
                    {
                        "onCurve": true,
                        "x": 0.022,
                        "y": -0.309
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.016,
                "yMin": -0.649,
                "xMax": 0.303,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.252,
                        "y": -0.598
                    },
                    {
                        "onCurve": true,
                        "x": 0.252,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.303,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.303,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.016,
                        "y": -0.598
                    }
                ]
            ],
            "advanceWidth": 0.528
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.011,
                "yMin": -0.949,
                "xMax": 0.336,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": -0.887
                    },
                    {
                        "onCurve": true,
                        "x": 0.274,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.336,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.336,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.011,
                        "y": -0.887
                    }
                ]
            ],
            "advanceWidth": 0.583
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.005,
                "yMin": -1.249,
                "xMax": 0.369,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": -1.176
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.369,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.369,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": -1.249
                    },
                    {
                        "onCurve": true,
                        "x": 0.005,
                        "y": -1.176
                    }
                ]
            ],
            "advanceWidth": 0.639
        }
	],
	
    "10216": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.11,
                "yMin": -0.25,
                "xMax": 0.333,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": -0.232
                    },
                    {
                        "onCurve": false,
                        "x": 0.332,
                        "y": -0.239
                    },
                    {
                        "onCurve": false,
                        "x": 0.321,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.313,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.303,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": -0.24
                    },
                    {
                        "onCurve": false,
                        "x": 0.293,
                        "y": -0.233
                    },
                    {
                        "onCurve": false,
                        "x": 0.11,
                        "y": 0.245
                    },
                    {
                        "onCurve": false,
                        "x": 0.11,
                        "y": 0.255
                    },
                    {
                        "onCurve": false,
                        "x": 0.293,
                        "y": 0.733
                    },
                    {
                        "onCurve": true,
                        "x": 0.296,
                        "y": 0.74
                    },
                    {
                        "onCurve": false,
                        "x": 0.299,
                        "y": 0.745
                    },
                    {
                        "onCurve": true,
                        "x": 0.306,
                        "y": 0.749
                    },
                    {
                        "onCurve": true,
                        "x": 0.309,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.312,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.313,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.331,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.333,
                        "y": 0.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": 0.727
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": 0.489
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 0.252
                    },
                    {
                        "onCurve": false,
                        "x": 0.152,
                        "y": 0.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.243,
                        "y": 0.011
                    },
                    {
                        "onCurve": false,
                        "x": 0.333,
                        "y": -0.227
                    }
                ]
            ],
            "advanceWidth": 0.389
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.097,
                "yMin": -0.35,
                "xMax": 0.394,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.373,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.392,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": 0.832
                    },
                    {
                        "onCurve": false,
                        "x": 0.394,
                        "y": 0.825
                    },
                    {
                        "onCurve": true,
                        "x": 0.267,
                        "y": 0.538
                    },
                    {
                        "onCurve": true,
                        "x": 0.139,
                        "y": 0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.267,
                        "y": -0.038
                    },
                    {
                        "onCurve": false,
                        "x": 0.394,
                        "y": -0.325
                    },
                    {
                        "onCurve": true,
                        "x": 0.394,
                        "y": -0.332
                    },
                    {
                        "onCurve": false,
                        "x": 0.392,
                        "y": -0.35
                    },
                    {
                        "onCurve": true,
                        "x": 0.375,
                        "y": -0.35
                    },
                    {
                        "onCurve": false,
                        "x": 0.362,
                        "y": -0.35
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": -0.338
                    },
                    {
                        "onCurve": false,
                        "x": 0.354,
                        "y": -0.331
                    },
                    {
                        "onCurve": false,
                        "x": 0.224,
                        "y": -0.04
                    },
                    {
                        "onCurve": false,
                        "x": 0.097,
                        "y": 0.246
                    },
                    {
                        "onCurve": false,
                        "x": 0.097,
                        "y": 0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.224,
                        "y": 0.54
                    },
                    {
                        "onCurve": false,
                        "x": 0.354,
                        "y": 0.831
                    },
                    {
                        "onCurve": true,
                        "x": 0.356,
                        "y": 0.838
                    },
                    {
                        "onCurve": false,
                        "x": 0.363,
                        "y": 0.85
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.112,
                "yMin": -0.649,
                "xMax": 0.523,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.112,
                        "y": 0.244
                    },
                    {
                        "onCurve": true,
                        "x": 0.112,
                        "y": 0.258
                    },
                    {
                        "onCurve": true,
                        "x": 0.29,
                        "y": 0.689
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": 1.061
                    },
                    {
                        "onCurve": true,
                        "x": 0.473,
                        "y": 1.13
                    },
                    {
                        "onCurve": false,
                        "x": 0.479,
                        "y": 1.141
                    },
                    {
                        "onCurve": false,
                        "x": 0.488,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.498,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.51,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.524,
                        "y": 1.135
                    },
                    {
                        "onCurve": true,
                        "x": 0.523,
                        "y": 1.125
                    },
                    {
                        "onCurve": true,
                        "x": 0.523,
                        "y": 1.118
                    },
                    {
                        "onCurve": true,
                        "x": 0.344,
                        "y": 0.685
                    },
                    {
                        "onCurve": false,
                        "x": 0.304,
                        "y": 0.587
                    },
                    {
                        "onCurve": false,
                        "x": 0.209,
                        "y": 0.359
                    },
                    {
                        "onCurve": true,
                        "x": 0.187,
                        "y": 0.305
                    },
                    {
                        "onCurve": true,
                        "x": 0.165,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.344,
                        "y": -0.184
                    },
                    {
                        "onCurve": true,
                        "x": 0.523,
                        "y": -0.616
                    },
                    {
                        "onCurve": true,
                        "x": 0.523,
                        "y": -0.623
                    },
                    {
                        "onCurve": false,
                        "x": 0.524,
                        "y": -0.634
                    },
                    {
                        "onCurve": false,
                        "x": 0.509,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.499,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.484,
                        "y": -0.649
                    },
                    {
                        "onCurve": true,
                        "x": 0.473,
                        "y": -0.629
                    },
                    {
                        "onCurve": false,
                        "x": 0.446,
                        "y": -0.56
                    },
                    {
                        "onCurve": true,
                        "x": 0.29,
                        "y": -0.188
                    }
                ]
            ],
            "advanceWidth": 0.611
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.126,
                "yMin": -0.95,
                "xMax": 0.654,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.126,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.126,
                        "y": 0.259
                    },
                    {
                        "onCurve": true,
                        "x": 0.361,
                        "y": 0.845
                    },
                    {
                        "onCurve": false,
                        "x": 0.595,
                        "y": 1.431
                    },
                    {
                        "onCurve": true,
                        "x": 0.597,
                        "y": 1.435
                    },
                    {
                        "onCurve": false,
                        "x": 0.608,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.624,
                        "y": 1.45
                    },
                    {
                        "onCurve": false,
                        "x": 0.637,
                        "y": 1.45
                    },
                    {
                        "onCurve": false,
                        "x": 0.654,
                        "y": 1.432
                    },
                    {
                        "onCurve": true,
                        "x": 0.654,
                        "y": 1.419
                    },
                    {
                        "onCurve": true,
                        "x": 0.654,
                        "y": 1.411
                    },
                    {
                        "onCurve": true,
                        "x": 0.422,
                        "y": 0.831
                    },
                    {
                        "onCurve": false,
                        "x": 0.19,
                        "y": 0.253
                    },
                    {
                        "onCurve": false,
                        "x": 0.19,
                        "y": 0.247
                    },
                    {
                        "onCurve": true,
                        "x": 0.422,
                        "y": -0.331
                    },
                    {
                        "onCurve": true,
                        "x": 0.654,
                        "y": -0.91
                    },
                    {
                        "onCurve": true,
                        "x": 0.654,
                        "y": -0.919
                    },
                    {
                        "onCurve": false,
                        "x": 0.654,
                        "y": -0.933
                    },
                    {
                        "onCurve": false,
                        "x": 0.636,
                        "y": -0.95
                    },
                    {
                        "onCurve": false,
                        "x": 0.612,
                        "y": -0.95
                    },
                    {
                        "onCurve": true,
                        "x": 0.597,
                        "y": -0.935
                    },
                    {
                        "onCurve": false,
                        "x": 0.595,
                        "y": -0.931
                    },
                    {
                        "onCurve": true,
                        "x": 0.361,
                        "y": -0.345
                    }
                ]
            ],
            "advanceWidth": 0.75
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.14,
                "yMin": -1.248,
                "xMax": 0.703,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.14,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.14,
                        "y": 0.26
                    },
                    {
                        "onCurve": true,
                        "x": 0.386,
                        "y": 0.994
                    },
                    {
                        "onCurve": false,
                        "x": 0.633,
                        "y": 1.729
                    },
                    {
                        "onCurve": true,
                        "x": 0.635,
                        "y": 1.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.643,
                        "y": 1.745
                    },
                    {
                        "onCurve": true,
                        "x": 0.657,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.666,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.668,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.682,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.702,
                        "y": 1.73
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": 1.714
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": 1.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.457,
                        "y": -0.478
                    },
                    {
                        "onCurve": true,
                        "x": 0.703,
                        "y": -1.204
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": -1.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.702,
                        "y": -1.229
                    },
                    {
                        "onCurve": false,
                        "x": 0.683,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.667,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.647,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.635,
                        "y": -1.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.633,
                        "y": -1.228
                    },
                    {
                        "onCurve": true,
                        "x": 0.386,
                        "y": -0.493
                    }
                ]
            ],
            "advanceWidth": 0.806
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.14,
                "yMin": -1.248,
                "xMax": 0.703,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.14,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.14,
                        "y": 0.26
                    },
                    {
                        "onCurve": true,
                        "x": 0.635,
                        "y": 1.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.643,
                        "y": 1.745
                    },
                    {
                        "onCurve": true,
                        "x": 0.657,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.658,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.666,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.668,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.682,
                        "y": 1.749
                    },
                    {
                        "onCurve": false,
                        "x": 0.702,
                        "y": 1.73
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": 1.714
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": 1.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.214,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.703,
                        "y": -1.204
                    },
                    {
                        "onCurve": true,
                        "x": 0.702,
                        "y": -1.213
                    },
                    {
                        "onCurve": false,
                        "x": 0.702,
                        "y": -1.229
                    },
                    {
                        "onCurve": false,
                        "x": 0.683,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.667,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.647,
                        "y": -1.248
                    },
                    {
                        "onCurve": true,
                        "x": 0.635,
                        "y": -1.231
                    }
                ]
            ],
            "advanceWidth": 0.806
        }
    ],
    "10217": [
        {
            "fontId": "Main-Regular",
            "bbox": {
                "xMin": 0.055,
                "yMin": -0.25,
                "xMax": 0.278,
                "yMax": 0.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.055,
                        "y": 0.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.056,
                        "y": 0.739
                    },
                    {
                        "onCurve": false,
                        "x": 0.067,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.075,
                        "y": 0.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.085,
                        "y": 0.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.092,
                        "y": 0.74
                    },
                    {
                        "onCurve": false,
                        "x": 0.095,
                        "y": 0.733
                    },
                    {
                        "onCurve": false,
                        "x": 0.278,
                        "y": 0.255
                    },
                    {
                        "onCurve": false,
                        "x": 0.278,
                        "y": 0.245
                    },
                    {
                        "onCurve": false,
                        "x": 0.095,
                        "y": -0.233
                    },
                    {
                        "onCurve": true,
                        "x": 0.092,
                        "y": -0.24
                    },
                    {
                        "onCurve": false,
                        "x": 0.085,
                        "y": -0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.075,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.067,
                        "y": -0.25
                    },
                    {
                        "onCurve": false,
                        "x": 0.056,
                        "y": -0.239
                    },
                    {
                        "onCurve": true,
                        "x": 0.055,
                        "y": -0.232
                    },
                    {
                        "onCurve": false,
                        "x": 0.055,
                        "y": -0.227
                    },
                    {
                        "onCurve": true,
                        "x": 0.145,
                        "y": 0.011
                    },
                    {
                        "onCurve": false,
                        "x": 0.236,
                        "y": 0.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.236,
                        "y": 0.252
                    },
                    {
                        "onCurve": true,
                        "x": 0.145,
                        "y": 0.489
                    },
                    {
                        "onCurve": false,
                        "x": 0.055,
                        "y": 0.727
                    }
                ]
            ],
            "advanceWidth": 0.389
        },
        {
            "fontId": "Size1-Regular",
            "bbox": {
                "xMin": 0.077,
                "yMin": -0.35,
                "xMax": 0.374,
                "yMax": 0.85
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.077,
                        "y": 0.832
                    },
                    {
                        "onCurve": false,
                        "x": 0.079,
                        "y": 0.85
                    },
                    {
                        "onCurve": true,
                        "x": 0.098,
                        "y": 0.85
                    },
                    {
                        "onCurve": false,
                        "x": 0.11,
                        "y": 0.849
                    },
                    {
                        "onCurve": true,
                        "x": 0.115,
                        "y": 0.838
                    },
                    {
                        "onCurve": false,
                        "x": 0.117,
                        "y": 0.831
                    },
                    {
                        "onCurve": false,
                        "x": 0.247,
                        "y": 0.54
                    },
                    {
                        "onCurve": false,
                        "x": 0.374,
                        "y": 0.254
                    },
                    {
                        "onCurve": false,
                        "x": 0.374,
                        "y": 0.246
                    },
                    {
                        "onCurve": false,
                        "x": 0.247,
                        "y": -0.04
                    },
                    {
                        "onCurve": false,
                        "x": 0.117,
                        "y": -0.331
                    },
                    {
                        "onCurve": true,
                        "x": 0.115,
                        "y": -0.338
                    },
                    {
                        "onCurve": false,
                        "x": 0.109,
                        "y": -0.35
                    },
                    {
                        "onCurve": true,
                        "x": 0.096,
                        "y": -0.35
                    },
                    {
                        "onCurve": false,
                        "x": 0.079,
                        "y": -0.35
                    },
                    {
                        "onCurve": true,
                        "x": 0.077,
                        "y": -0.332
                    },
                    {
                        "onCurve": false,
                        "x": 0.077,
                        "y": -0.325
                    },
                    {
                        "onCurve": true,
                        "x": 0.204,
                        "y": -0.038
                    },
                    {
                        "onCurve": true,
                        "x": 0.332,
                        "y": 0.25
                    },
                    {
                        "onCurve": true,
                        "x": 0.204,
                        "y": 0.538
                    },
                    {
                        "onCurve": false,
                        "x": 0.077,
                        "y": 0.825
                    }
                ]
            ],
            "advanceWidth": 0.472
        },
        {
            "fontId": "Size2-Regular",
            "bbox": {
                "xMin": 0.086,
                "yMin": -0.649,
                "xMax": 0.498,
                "yMax": 1.15
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.112,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.102,
                        "y": -0.649
                    },
                    {
                        "onCurve": false,
                        "x": 0.086,
                        "y": -0.633
                    },
                    {
                        "onCurve": true,
                        "x": 0.087,
                        "y": -0.623
                    },
                    {
                        "onCurve": true,
                        "x": 0.087,
                        "y": -0.616
                    },
                    {
                        "onCurve": true,
                        "x": 0.266,
                        "y": -0.184
                    },
                    {
                        "onCurve": true,
                        "x": 0.445,
                        "y": 0.251
                    },
                    {
                        "onCurve": false,
                        "x": 0.445,
                        "y": 0.252
                    },
                    {
                        "onCurve": false,
                        "x": 0.267,
                        "y": 0.68
                    },
                    {
                        "onCurve": false,
                        "x": 0.088,
                        "y": 1.116
                    },
                    {
                        "onCurve": true,
                        "x": 0.086,
                        "y": 1.123
                    },
                    {
                        "onCurve": false,
                        "x": 0.085,
                        "y": 1.133
                    },
                    {
                        "onCurve": false,
                        "x": 0.099,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.11,
                        "y": 1.15
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": 1.15
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": 1.137
                    },
                    {
                        "onCurve": false,
                        "x": 0.134,
                        "y": 1.136
                    },
                    {
                        "onCurve": true,
                        "x": 0.317,
                        "y": 0.695
                    },
                    {
                        "onCurve": true,
                        "x": 0.498,
                        "y": 0.258
                    },
                    {
                        "onCurve": true,
                        "x": 0.498,
                        "y": 0.244
                    },
                    {
                        "onCurve": true,
                        "x": 0.317,
                        "y": -0.194
                    },
                    {
                        "onCurve": false,
                        "x": 0.134,
                        "y": -0.635
                    },
                    {
                        "onCurve": true,
                        "x": 0.133,
                        "y": -0.636
                    },
                    {
                        "onCurve": false,
                        "x": 0.126,
                        "y": -0.649
                    }
                ]
            ],
            "advanceWidth": 0.611
        },
        {
            "fontId": "Size3-Regular",
            "bbox": {
                "xMin": 0.094,
                "yMin": -0.949,
                "xMax": 0.623,
                "yMax": 1.45
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.125,
                        "y": -0.949
                    },
                    {
                        "onCurve": false,
                        "x": 0.095,
                        "y": -0.949
                    },
                    {
                        "onCurve": true,
                        "x": 0.095,
                        "y": -0.919
                    },
                    {
                        "onCurve": true,
                        "x": 0.095,
                        "y": -0.91
                    },
                    {
                        "onCurve": true,
                        "x": 0.327,
                        "y": -0.331
                    },
                    {
                        "onCurve": false,
                        "x": 0.559,
                        "y": 0.247
                    },
                    {
                        "onCurve": false,
                        "x": 0.559,
                        "y": 0.253
                    },
                    {
                        "onCurve": true,
                        "x": 0.327,
                        "y": 0.831
                    },
                    {
                        "onCurve": false,
                        "x": 0.094,
                        "y": 1.411
                    },
                    {
                        "onCurve": true,
                        "x": 0.094,
                        "y": 1.424
                    },
                    {
                        "onCurve": false,
                        "x": 0.094,
                        "y": 1.426
                    },
                    {
                        "onCurve": true,
                        "x": 0.095,
                        "y": 1.428
                    },
                    {
                        "onCurve": false,
                        "x": 0.104,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.124,
                        "y": 1.45
                    },
                    {
                        "onCurve": false,
                        "x": 0.141,
                        "y": 1.45
                    },
                    {
                        "onCurve": true,
                        "x": 0.152,
                        "y": 1.435
                    },
                    {
                        "onCurve": false,
                        "x": 0.154,
                        "y": 1.431
                    },
                    {
                        "onCurve": true,
                        "x": 0.388,
                        "y": 0.845
                    },
                    {
                        "onCurve": true,
                        "x": 0.623,
                        "y": 0.259
                    },
                    {
                        "onCurve": true,
                        "x": 0.623,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.388,
                        "y": -0.345
                    },
                    {
                        "onCurve": false,
                        "x": 0.153,
                        "y": -0.933
                    },
                    {
                        "onCurve": true,
                        "x": 0.152,
                        "y": -0.934
                    },
                    {
                        "onCurve": false,
                        "x": 0.144,
                        "y": -0.949
                    }
                ]
            ],
            "advanceWidth": 0.75
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.103,
                "yMin": -1.248,
                "xMax": 0.665,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.138,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.122,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.103,
                        "y": -1.229
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": -1.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": -1.204
                    },
                    {
                        "onCurve": false,
                        "x": 0.184,
                        "y": -0.961
                    },
                    {
                        "onCurve": false,
                        "x": 0.509,
                        "y": 0.008
                    },
                    {
                        "onCurve": true,
                        "x": 0.591,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": 1.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": 1.714
                    },
                    {
                        "onCurve": false,
                        "x": 0.103,
                        "y": 1.73
                    },
                    {
                        "onCurve": false,
                        "x": 0.122,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.137,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.157,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.17,
                        "y": 1.732
                    },
                    {
                        "onCurve": false,
                        "x": 0.172,
                        "y": 1.729
                    },
                    {
                        "onCurve": true,
                        "x": 0.419,
                        "y": 0.994
                    },
                    {
                        "onCurve": true,
                        "x": 0.665,
                        "y": 0.26
                    },
                    {
                        "onCurve": true,
                        "x": 0.665,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.419,
                        "y": -0.493
                    },
                    {
                        "onCurve": false,
                        "x": 0.172,
                        "y": -1.228
                    },
                    {
                        "onCurve": true,
                        "x": 0.17,
                        "y": -1.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.158,
                        "y": -1.248
                    }
                ]
            ],
            "advanceWidth": 0.806
        },
        {
            "fontId": "Size4-Regular",
            "bbox": {
                "xMin": 0.103,
                "yMin": -1.248,
                "xMax": 0.665,
                "yMax": 1.75
            },
            "contours": [
                [
                    {
                        "onCurve": true,
                        "x": 0.138,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.122,
                        "y": -1.248
                    },
                    {
                        "onCurve": false,
                        "x": 0.103,
                        "y": -1.229
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": -1.213
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": -1.204
                    },
                    {
                        "onCurve": true,
                        "x": 0.591,
                        "y": 0.251
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": 1.705
                    },
                    {
                        "onCurve": true,
                        "x": 0.103,
                        "y": 1.714
                    },
                    {
                        "onCurve": false,
                        "x": 0.103,
                        "y": 1.73
                    },
                    {
                        "onCurve": false,
                        "x": 0.122,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.137,
                        "y": 1.75
                    },
                    {
                        "onCurve": false,
                        "x": 0.157,
                        "y": 1.75
                    },
                    {
                        "onCurve": true,
                        "x": 0.17,
                        "y": 1.732
                    },
                    {
                        "onCurve": true,
                        "x": 0.665,
                        "y": 0.26
                    },
                    {
                        "onCurve": true,
                        "x": 0.665,
                        "y": 0.242
                    },
                    {
                        "onCurve": true,
                        "x": 0.17,
                        "y": -1.231
                    },
                    {
                        "onCurve": false,
                        "x": 0.158,
                        "y": -1.248
                    }
                ]
            ],
            "advanceWidth": 0.806
        }
    ]
};

interface ShiftData {
    downShifted: Vector2,
    upShifted: Vector2
};

const extensionData: { [unicode: string]: ShiftData } = {
	"40": {
		downShifted: [25, 10],
		upShifted: [10, 25]
	},
	"41": {
		downShifted: [10, 27],
		upShifted: [27, 10]
	},

	"91": {
		downShifted: [5, 1],
		upShifted: [1, 5]
	},
	"93": {
		downShifted: [3, 7], 
		upShifted: [7, 3]
	},

	"123": {
		downShifted: [79, 10],
		upShifted: [41, 64]
	},
	"125": {
		downShifted: [39, 62],
		upShifted: [79, 15]
	},

	"8739": {
		downShifted: [9, 3],
		upShifted: [4, 9]
	},

	"8968": {
		downShifted: [5, 1],
		upShifted: [1, 5]
	},
	"8969": {
		downShifted: [3, 5],
		upShifted: [5, 3]
	},

	"8970": {
		downShifted: [3, 1],
		upShifted: [1, 3]
	},
	"8971": {
		downShifted: [3, 1],
		upShifted: [1, 3]
	},

	"10216": {
		downShifted: [13, 0], 
		upShifted: [2, 12]
	},
	"10217": {
		downShifted: [15, 5],
		upShifted: [6, 13]
	}
};

const isNumInLoopingRange = (start: number, end: number, num: number) : boolean => {
	return (end > start) ? (num >= start && num < end) : (num >= start || num < end);
};
const translateGlyphPoint = (glyphPoint: GlyphPoint, translation: Vector2) : GlyphPoint => {
	return {
		...glyphPoint, 
		x: glyphPoint.x + translation[0],
		y: glyphPoint.y + translation[1]
	}
};
const getGlyphTranslationByShiftData = (index: number, shiftData: ShiftData, extension: number) : number => {
	if (isNumInLoopingRange(shiftData.downShifted[0], shiftData.downShifted[1], index)) return -extension;
	if (isNumInLoopingRange(shiftData.upShifted[0], shiftData.upShifted[1], index)) return extension;
	return 0;
};
const extendContour = (contour: Contour, shiftData: ShiftData, extension: number) : Contour => contour.map((glyphPoint, index) => {
	return translateGlyphPoint(glyphPoint, [0, getGlyphTranslationByShiftData(index, shiftData, extension)]);
});

//the height and depth should be the same for all delimiters, 
//here only height is returned, so half of the vertical size
const axisHeight = 0.25;
const getHeightOfDelimiterToAxis = (bbox: BoundingBox) : number => bbox.yMax - axisHeight;

const lookUpGlyphByHeightToAxis = (unicode: number, heightFromAxis: number) : GlyphData => delimiterFontData[unicode]
	.find((entry, index) => index === delimiterFontData[unicode].length - 1 || getHeightOfDelimiterToAxis(entry.bbox) >= heightFromAxis);

const generateDelimiterContours = (unicode: number, heightFromAxis: number) : { contours: Contour[], dimensions: Dimensions } => {
	const entry = lookUpGlyphByHeightToAxis(unicode, heightFromAxis);
	const { bbox } = entry;
	const entryHeight = getHeightOfDelimiterToAxis(bbox);
	if (entryHeight >= heightFromAxis) {
		const sizeRatio = heightFromAxis / entryHeight;
		const matrix : [number, number, number, number, number, number] = [sizeRatio, 0, 0, sizeRatio, 0, (1 - sizeRatio) * axisHeight];
		const scaledContours = entry.contours.map(contour => transformContour(matrix, contour));
		const scaledBbox = transformBbox(matrix, entry.bbox);
		return {
			contours: scaledContours,
			dimensions: {
				...pick(["yMin", "yMax"], scaledBbox),
				width: entry.advanceWidth * sizeRatio
			}
		};
	}
	const remainingHeight = heightFromAxis - entryHeight;
	if (extensionData[unicode]) {
		const extendableEntry = lastInArray(delimiterFontData[unicode]);
		const extendedContour = extendContour(extendableEntry.contours[0], extensionData[unicode], remainingHeight);
		return {
			contours: [extendedContour],
			dimensions: {
				yMin: bbox.yMin - remainingHeight, 
				yMax: bbox.yMax + remainingHeight, 
				width: entry.advanceWidth
			}
		};
	}
};
export const createDelimiter = (unicode: number, heightFromAxis: number) : ContoursNode => {
	const contoursData = generateDelimiterContours(unicode, heightFromAxis);
	if (!contoursData) return;
	return {
		type: "contours",
		...contoursData
	};
};


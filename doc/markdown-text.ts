
import boxNodeStr from './box-node/box-node';
import charNodeStr from './char-node/char-node';
import contoursStr from './contours/contours';
import descriptionStr from './description/description';
import disclaimerStr from './disclaimer';
import exampleStr from './example/example';
import fontStr from './fonts/fonts';
import formulaNodeStr from './formula-node';
import fractionStr from './fraction/fraction';
import mathlistStr from './mathlist/mathlist';
import styleStr from './style/style';
import textNodeStr from './text-node/text-node';

import scriptStr from './script/script';
import accentStr from './accent/accent';
import matrixStr from './matrix/matrix';
import rootStr from './root/root';
import delimitedStr from './delimited/delimited';

export const markdownStr = [
    descriptionStr,
    disclaimerStr,
    exampleStr,
    styleStr,
	fontStr,
	
    formulaNodeStr,
	boxNodeStr,
	contoursStr,

	charNodeStr,
	textNodeStr,
	mathlistStr,
	fractionStr,
	scriptStr,
	accentStr,
	matrixStr,
	rootStr,
	delimitedStr
];

// export const markdownStr = `

// ${descriptionStr}
// ${disclaimerStr}

// ## installation  
// todo

// ${exampleStr}

// ## Fonts  
// ---------
// <font-overview-table></font-overview-table>
// todo: table with all possible glyphs

// ${styleStr}

// ${formulaNodeStr}
// ${boxNodeStr}
// ${contoursStr}

// ${charNodeStr}
// ${textNodeStr}
// ${mathlistStr}
// ${fractionStr}
// ${scriptStr}
// ${accentStr}
// ${matrixStr}
// ${rootStr}
// ${delimitedStr}
// `;
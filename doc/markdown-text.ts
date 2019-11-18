
import descriptionStr from './description/description';
import disclaimerStr from './disclaimer';
import exampleStr from './example/example';
import styleStr from './style/style';
import '../dev/explainer/fonts-overview';
import formulaNodeStr from './formula-node';
import boxNodeStr from './box-node/box-node';
import contoursStr from './contours/contours';

import charNodeStr from './char-node/char-node';
import textNodeStr from './text-node/text-node';
import mathlistStr from './mathlist/mathlist';
import fractionStr from './fraction/fraction';
import scriptStr from './script/script';
import matrixStr from './matrix/matrix';
import rootStr from './root/root';


export const markdownStr = `

${descriptionStr}
${disclaimerStr}

## installation  
todo

${exampleStr}

## Fonts  
---------
<font-overview-table></font-overview-table>
todo: table with all possible glyphs

${styleStr}

${formulaNodeStr}
${boxNodeStr}
${contoursStr}

${charNodeStr}
${textNodeStr}
${mathlistStr}
${fractionStr}
${scriptStr}

## accent  
----------

${matrixStr}
${rootStr}


## delimiter  
-------------


`;

import descriptionStr from './description/description';
import disclaimerStr from './disclaimer';
import exampleStr from './example/example';
import formulaNodeStr from './formula-node';
import styleStr from './style/style';
import textNodeStr from './text-node/text-node';
import mathlistStr from './mathlist/mathlist';
import fractionStr from './fraction/fraction';
import '../dev/explainer/fonts-overview';

export const markdownStr = `

${descriptionStr}
${disclaimerStr}

## installation  
todo

${exampleStr}

## Fonts  
---------
<font-overview-table></font-overview-table>

${styleStr}

${formulaNodeStr}

## BoxNode  
-----------

## CharNode
------------

types: ord, bin, rel, open, close, ...  
these types are basically only used for horizontal spacing.  
todo: available symbols
todo: aliases

${textNodeStr}

${mathlistStr}
${fractionStr}



## Script  
----------

## Root  
--------

## Delimiter  
-------------

## Accent  
----------

## Matrix  
----------



`;
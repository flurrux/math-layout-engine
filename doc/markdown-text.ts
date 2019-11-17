
import descriptionStr from './description/description';
import disclaimerStr from './disclaimer';
import exampleStr from './example/example';
import formulaNodeStr from './formula-node';
import styleStr from './style/style';
import mathlistStr from './mathlist/mathlist';
import fractionStr from './fraction/fraction';

export const markdownStr = `

${descriptionStr}
${disclaimerStr}

## installation  
todo

${exampleStr}
${formulaNodeStr}
${styleStr}




## Fonts  
---------

## BoxNode  
-----------

## CharNode
------------

types: ord, bin, rel, open, close, ...  
these types are basically only used for horizontal spacing.  
todo: available symbols
todo: aliases

## TextNode
------------

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
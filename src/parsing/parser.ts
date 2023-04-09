
/*
    the parse-function takes an expression as string, and outputs a FormulaNode. 
    
    examples of expressions:
    a + b + 3 * c = d / 5
    2 * \pi = \tau
    f(t) = 4 - 2 * t + 5 * t^3
    f(t) = c_0 + c_1 * t + c_2 * t^2 + c_3 * t^3 + \...
    2^{2^2} = 8
    t_1^3 * t_2^2 * t_4 * t_5^3
    (\frac({1}{2 + (\frac({1}{3 + (\frac({1}{4 + \...}))}))}))

    features: 
	- binary operators, relations, punctuation 
	- unary operators
    - numbers, 24, 0.01, 3.1457
    - sub- and superscripts, a^b, a_c, a^b_c, a_c^b,
        a^b_c and a_c^b are equivalent, order does not matter
    - special characters by \[alias], example: \gamma
    - grouping by {}, everything inside curly braces will be parsed to a single node
    - autosized delimiter, ()[]{}⌈⌉⌊⌋||, 
        curly braces must be escaped to act as delimiters: \{ and \}
    - roots, 
        root({2}) is the square-root of 2
		root({2}{3}) is the cube-root of 2
	- fractions, \fraction({1}{2})	
	- accents, example: \accent({v}{\vector})
	- matrix, example: \matrix({1}{0}, {0}{1}), 
		the size of the matrix is infered from the colons
    - text


	todo: 
	- functions like sin, ln, ...
    - maybe instead of frac({a}{b}) just use a / b,
    and if inline fractions are desired, escape the slash: a \/ b
    - better handling of text-functions, 
        currently, the end of a text-function is determined by 
        looking at the corresponding closing parenthesis. 
        however the text could be like: func(t), so: \text(func(t))
        which would we interpreted as \text(func(t) -> func(t.     
    - complete error handling with position of error in the text     


	algorithm: 
	- first tokenize the entire expression:
		- process text-functions, converts text-functions into FormulaNodes
		- process escape-sequences, example: \pi, \frac
			escape sequences are either function-names or aliases. 
			aliases are converted directly into FormulaNodes.
			function-names are converted into FunctionNameTokens
		- convert number-literals into either ord- or text-nodes 
		- tokenize unescaped braces 
		- convert chars to FormulaNodes, + - ; f p and so on 
	- recursively parse the tokens:
		- detect groups by delimiters and parse them recursively
        - parse functions by supplying them with their arguments
        - parse scripts 
        - if the result is an array, pack it into a mathlist, if not, return the node    

*/

import pipe from "ramda/src/pipe";
import { FormulaNode } from "../types";
import { tokenize } from "./tokenization";
import { parseTokenLayer } from "./parsing";


export const parse = (expression: string): FormulaNode => {
	return pipe(
		tokenize,
		parseTokenLayer
	)(expression);
};
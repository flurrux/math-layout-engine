
const tabSize = 4;

export default (str: string) : string => {
    const newLineChar = String.fromCharCode(10);
    const lines = unpadSplitArray(str.split(newLineChar));
    const indentationLevel = getIndentationInSpaces(lines[0]);
    const result = lines.map(removeIndentation(indentationLevel)).join(newLineChar);
    return result;
};

const isCharCode = (char: string, charCode: number) => char.charCodeAt(0) === charCode;
const isTab = (char: string) => isCharCode(char, 9);
const isSpace = (char: string) => isCharCode(char, 32);

const unpadSplitArray = (lines: string[]) : string[] => [
    ...(lines[0] === "" ? [] : [lines[0]]),
    ...lines.slice(1, lines.length - 1),
    ...(lines[0] === "" ? [] : [lines[0]]),
];
const getIndentationInSpaces = (str: string) : number => {
    let indentation = 0;
    for (let i = 0; i < str.length; i++){
        const char = str[i];
        if (isTab(char)){
            indentation += tabSize;
        }
        else if (isSpace(char)){
            indentation++;
        }
        else {
            break;
        }
    }
    return indentation;
};
const removeIndentation = (spaces: number) => ((line: string) => {
    let currentIndentation = 0;
    let startIndex = 0;
    for (let i = 0; i < line.length; i++){
        const char = line[i];
        if (isTab(char)){
            currentIndentation += tabSize;
        }
        else if (isSpace(char)){
            currentIndentation++;
        }

        if (currentIndentation === spaces){
            startIndex = i + 1;
            break;
        }
    }
    return line.substr(startIndex);
});
export default (str: string) : string => {
    const newLineChar = String.fromCharCode(10);
    const lines = unpadSplitArray(str.split(newLineChar));
    const indentationLevel = getIndentationLevel(lines[0]);
    return lines.map(removeIndentation(indentationLevel)).join(newLineChar);
};

const removeIndentation = (level: number) => ((line: string) => {
    const tabSize = 4;
    return line.substr(tabSize * level);
});

const unpadSplitArray = (lines: string[]) : string[] => [
    ...(lines[0] === "" ? [] : [lines[0]]),
    ...lines.slice(1, lines.length - 1),
    ...(lines[0] === "" ? [] : [lines[0]]),
];
const getIndentationLevel = (str: string) : number => {
    const tabSize = 4;
    let level = 0;
    let currentSpaceCount = 0;
    for (let i = 0; i < str.length; i++){
        const char = str[i];
        const unicode = char.charCodeAt(0);
        if (unicode === 9){
            level++;
            continue;
        }
        else if (unicode === 32){
            currentSpaceCount++;
        }
        if (currentSpaceCount === tabSize){
            level++;
            currentSpaceCount = 0;
        }

        if (unicode !== 9 && unicode !== 32){
            break;
        }
    }
    return level;
};
const getIndentationLevel = line => {
    for (let i = 0; i < line.length; i++){
        if (line[i].charCodeAt(0) !== 32){
            return i;
        }
    }
    return line.length;
};
export const removeIndentation = text => {
    const lines = text.split("\n").filter(line => line !== "");
    const indentationLevel = getIndentationLevel(lines[0]);
    const linesWithoutIndentation = lines.map(line => line.substr(indentationLevel));
    console.log(linesWithoutIndentation);
    const result = linesWithoutIndentation.join("\n");
    console.log(result);
    return result;
};
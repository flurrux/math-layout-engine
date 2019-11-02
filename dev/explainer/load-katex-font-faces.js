export const loadKatexFontFaces = async () => {
    const data = [
        {
            fontFamily: "AMS",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Caligraphic",
            styleAndWeights: [["normal", "normal"], ["normal", "bold"]]
        },
        {
            fontFamily: "Fraktur",
            styleAndWeights: [["normal", "normal"], ["normal", "bold"]]
        },
        {
            fontFamily: "Main",
            styleAndWeights: [["normal", "normal"], ["normal", "bold"], ["italic", "normal"], ["italic", "bold"]]
        },
        {
            fontFamily: "Math",
            styleAndWeights: [["italic", "normal"], ["italic", "bold"]]
        },
        {
            fontFamily: "SansSerif",
            styleAndWeights: [["normal", "normal"], ["normal", "bold"], ["italic", "normal"]]
        },
        {
            fontFamily: "Script",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Size1",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Size2",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Size3",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Size4",
            styleAndWeights: [["normal", "normal"]]
        },
        {
            fontFamily: "Typewriter",
            styleAndWeights: [["normal", "normal"]]
        }
    ];

    const fontFaces = data.reduce((fontFaces, entry) => {
        const name = `KaTeX_${entry.fontFamily}`;
        for (const styleAndWeight of entry.styleAndWeights){
            const [style, weight] = styleAndWeight;
            const styleStr = style === "italic" ? "Italic" : "Regular";
            const combinedEmph = weight === "normal" ? styleStr : (style === "normal" ? "Bold" : "BoldItalic");
            const url = `https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/fonts/KaTeX_${entry.fontFamily}-${combinedEmph}.ttf`;

            const fontFace = new FontFace(name, `url(${url})`);
            Object.assign(fontFace, { style, weight });
            fontFaces.push(fontFace);
        }
        return fontFaces;
    }, []);
    fontFaces.map(face => document.fonts.add(face));
    return Promise.all(fontFaces.map(face => face.load()));
};
function replaceAsciiCodes(eenput, delimiters = ["'", '"', '`', '[', ']']) {
    // hello explorer!
    // im gonna make this easy to understand for you, since it was really hard for me to write too
    const delimiterPattern = delimiters.map(delimiter => `\\${delimiter}`).join('|');

    // regex explanation:
    // 1. capture an opening delimiter ([${delimiterPattern}])
    // 2. capture one or more ASCII codes in the form \\[number] (e.g., \104)
    // 3. capture a closing delimiter ([${delimiterPattern}])
    const asciiRegex = new RegExp(`([${delimiterPattern}])((?:\\\\\\d{2,3})+)([${delimiterPattern}])`, "g");
    
    // replace matches with decoded ASCII characters
    return eenput.replace(asciiRegex, (match, openDelimiter, asciiCodes, closeDelimiter) => {
        // convert each ASCII code (e.g. \104) to a character
        const decodedChars = asciiCodes.replace(/\\(\d{2,3})/g, (_, code) => 
            String.fromCharCode(Number(code))
        );

        // return the decoded string with original delimiters
        return `${openDelimiter}${decodedChars}${closeDelimiter}`;
    });
}
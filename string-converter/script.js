let separator = document.getElementById("separator")
let input = document.getElementById("input");
let result = document.getElementById("results");

const blacklistedExtensions = [
    "exe", "dll", "so", "dylib", "bin", "lib", "a", "o",

    "class", "jar", "pyc", "pyo", "pyd", "pyd", "swiftmodule", "luac",

    "ios", "img", "dmg", "vmdk", "pkg",

    "zip", "rar", "7z", "tar", "gz", "bz2",

    "mp3", "wav", "flac", "mp4", "mkv", "avi", "mov", "jpg", "png", "gif", "bmp",

    "sys", "icns", "cur", "ico", "cab",

    "db", "sqlite", "dat", "bak",

    "bin", "rom", "elf"
];
const sizeThreshold = 5 // 5 MiB

function loadFromFile() {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.multiple = false;

    inputElement.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            if (blacklistedExtensions.includes(fileExtension)) {
                alert("This file type is not supported for text processing.");
                return
            }

            const fileSize = file.size / (1024 * 1024)
            if (fileSize > sizeThreshold) {
                const proceed = confirm(`File is quite large (${fileSize.toFixed(2)} MB). Browsers may struggle to display large content. Continue anyway?`);
                if (!proceed) return;
            }

            const text = await file.text();
            input.value = text;
        }
    }

    inputElement.click();
}

function saveToFile() {
    const blob = new Blob([result.value], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted-file.richy.lol.txt";
    link.click(); // trigger download
    URL.revokeObjectURL(link.href); // clean up url object
}

function updatePlaceholder() {
    let ifbackslash = "";
    if (separator.value == "\\") {
        ifbackslash = "\\"
    }

    let example = `${ifbackslash}99${separator.value}104${separator.value}105`;

    if (separator.value == "code") {
        example = `print("\\99\\104\\105"), console.log("\\99\\104\\105"), etc...`;
    }

    input.placeholder = example;
}

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

function convert() {
    if (separator.value == "code") {
        result.value = replaceAsciiCodes(input.value);
        return
    }

    let convertedResult = "";

    // regex to handle cases without leading separators
    let pattern;
    if (separator.value === "\\") {
        pattern = /\\?(\d{2,3})/g;
    } else {
        pattern = new RegExp(`(?:^|${separator.value})(\\d{2,3})`, "g");
    }

    const matches = [];
    let match;
    while ((match = pattern.exec(input.value)) !== null) {
        matches.push(match[1]);
    }

    if (matches) {
        matches.forEach(code => {
            const asciiCode = parseInt(code, 10);
            convertedResult += String.fromCharCode(asciiCode);
        });
    }

    result.value = convertedResult;
}

function copyToClipboard() {
    navigator.clipboard.writeText(result.value)
}

function removeWhitespace() {
    result.value = result.value.replace(/\s+/g, "");
}

function reverse() {
    result.value = result.value.split("").reverse().join("");
}

function toLowerCase() {
    result.value = result.value.toLowerCase();
}

function toUpperCase() {
    result.value = result.value.toUpperCase();
}
import { exit } from "process";
import * as fs from "fs";

function main(): void {
    const args = process.argv.slice(2);
    console.log(args);

    if (args.length < 1) {
        console.error("No arguments provided.");
        exit(-1);
    }

    switch (args[0]) {
        case "-c":
            // use slice to remove the first parameter. that way we only have file paths.
            CountBytes(args.slice(1));
            break;
        case "-l":
            CountLines(args.slice(1));
            break;
        case "-m":
            CountCharacters(args.slice(1));
            break;
        case "-w":
            CountWords(args.slice(1));
            break;
        default:
            GetDefaultCount(args);
            break;
    }
}

const byteSize = (str: string) => new Blob([str]).size;

function GetByteCount(fileContent: string): number {
    let count = 0;

    for (let j = 0; j < fileContent.length; j++) {
        count += byteSize(fileContent[j]);
    }
    return count;
}

function GetLineCount(fileContent: string): number {
    let count = 0;
    let isLine = false;

    for (let j = 0; j < fileContent.length; j++) {
        const char = fileContent[j];

        // Check for line endings
        if (char === "\n" || char === "\r\n") {
            isLine = false;
        } else if (!isLine) {
            isLine = true;
            count++;
        }
    }
    return count;
}

function GetCharacterCount(fileContent: string): number {
    let count = 0;

    for (let j = 0; j < fileContent.length; j++) {
        count++;
    }

    return count;
}

function GetWordCount(fileContent: string): number {
    let count = 0;
    let isWord = false;

    for (let j = 0; j < fileContent.length; j++) {
        const char = fileContent[j];

        // Check for word boundaries (space or newline)
        if (char === " " || char === "\n" || char === "\t" || char === "\r") {
            isWord = false;
        } else if (!isWord) {
            isWord = true;
            count++;
        }
    }
    return count;
}

function GetDefaultCount(filePaths: string[]): void {
    let totalByteCount = 0;
    let totalWordCount = 0;
    let totalLineCount = 0;

    for (let index = 0; index < filePaths.length; index++) {
        if (!fs.existsSync(filePaths[index])) {
            console.error(`wc: ${filePaths[index]}: No such file or directory`);
            continue;
        }

        let fileContent = fs.readFileSync(filePaths[index], "utf-8");
        let byteCount = GetByteCount(fileContent);
        let lineCount = GetLineCount(fileContent);
        let wordCount = GetWordCount(fileContent);

        totalByteCount += byteCount;
        totalLineCount += lineCount;
        totalWordCount += wordCount;

        console.log(
            `${lineCount} ${wordCount} ${byteCount} ${filePaths[index]}`
        );
    }

    if (filePaths.length > 1) {
        console.log(
            `${totalLineCount} ${totalWordCount} ${totalByteCount} total`
        );
    }
}

function CountItems(
    filePaths: string[],
    getCount: (content: string) => number,
    label: string
): void {
    let totalItemCount = 0;

    for (let index = 0; index < filePaths.length; index++) {
        let itemCount = 0;

        if (!fs.existsSync(filePaths[index])) {
            console.error(`wc: ${filePaths[index]}: No such file or directory`);
            continue;
        }

        let fileContent = fs.readFileSync(filePaths[index], "utf-8");
        itemCount = getCount(fileContent);
        totalItemCount += itemCount;

        console.log(`${itemCount} ${filePaths[index]}`);
    }

    if (filePaths.length > 1) {
        console.log(`${totalItemCount} total ${label}`);
    }
}

function CountBytes(filePaths: string[]): void {
    CountItems(filePaths, GetByteCount, "bytes");
}

function CountLines(filePaths: string[]): void {
    CountItems(filePaths, GetLineCount, "lines");
}

function CountCharacters(filePaths: string[]): void {
    CountItems(filePaths, GetCharacterCount, "characters");
}

function CountWords(filePaths: string[]): void {
    CountItems(filePaths, GetWordCount, "words");
}

main();

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
            GetDefaultCount(args.slice(1));
            break;
    }
}

// each switch function calls an internal function that returns a number -> the actual count function.
// the switch function iterates over each file
// if file exists, it counts and prints.
// if file does not exist,
function CountBytes(filePaths: string[]): void {}

function CountLines(filePaths: string[]): void {
    let totalLineCount = 0;

    for (let index = 0; index < filePaths.length; index++) {
        let lineCount = 0;

        if (!fs.existsSync(filePaths[index])) {
            console.error(`wc: ${filePaths[index]}: No such file or directory`);
            continue;
        }

        let fileContent = fs.readFileSync(filePaths[index], "utf-8");
        lineCount = GetLineCount(fileContent);
        totalLineCount += lineCount;

        console.log(`${lineCount} ${filePaths[index]}`);
    }

    if (filePaths.length > 1) {
        console.log(`${totalLineCount} total`);
    }
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

function CountCharacters(filePaths: string[]): void {
    let totalCharCount = 0;

    for (let index = 0; index < filePaths.length; index++) {
        let charCount = 0;

        if (!fs.existsSync(filePaths[index])) {
            console.error(`wc: ${filePaths[index]}: No such file or directory`);
            continue;
        }

        let fileContent = fs.readFileSync(filePaths[index], "utf-8");
        charCount = GetCharacterCount(fileContent);
        totalCharCount += charCount;

        console.log(`${charCount} ${filePaths[index]}`);
    }

    if (filePaths.length > 1) {
        console.log(`${totalCharCount} total`);
    }
}

function GetCharacterCount(fileContent: string): number {
    let count = 0;

    for (let j = 0; j < fileContent.length; j++) {
        count++;
    }

    return count;
}

function CountWords(filePaths: string[]): void {
    let totalWordCount = 0;

    for (let index = 0; index < filePaths.length; index++) {
        let wordCount = 0;

        if (!fs.existsSync(filePaths[index])) {
            console.error(`wc: ${filePaths[index]}: No such file or directory`);
            continue;
        }

        let fileContent = fs.readFileSync(filePaths[index], "utf-8");
        wordCount = GetWordCount(fileContent);
        totalWordCount += wordCount;

        console.log(`${wordCount} ${filePaths[index]}`);
    }

    if (filePaths.length > 1) {
        console.log(`${totalWordCount} total`);
    }
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

function GetDefaultCount(filePaths: string[]): void {}

function GetFileContent(filePath: string): string {
    return "";
}

main();

// ? accept command line arguments.
// ? check the command flag using a switch statement
// -c: number of bytes
// -l: number of lines
// -m: number of characters
// -w: word counts

// ? when multiple files are passed, e.g.: ccwc test.txt other.txt
// return count for each file
// return total count
// 2222 test.txt
// 1111 other.txt
// 3333 total

// ! if file isn't found, print the command and: No such file or directory, e.g.
// wc -c: o such file or directory

// first need to read the file
// then loop through counting the values
// then print the results

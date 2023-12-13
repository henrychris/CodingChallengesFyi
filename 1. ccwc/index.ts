import * as fs from "fs";
import { exit } from "process";
import { ReadStream } from "tty";

function main(): void {
    const args = process.argv.slice(2);
    console.log(args);

    // todo: handle the final case to read std input
    // todo: optimise by reading from stream
    // todo: write article. Show process from initial dirty implemenation to 'clean' version
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

//#region BYTES
const byteSize = (str: string) => new Blob([str]).size;

function GetByteCount(fileContent: string): number {
    let count = 0;

    for (let j = 0; j < fileContent.length; j++) {
        count += byteSize(fileContent[j]);
    }
    return count;
}

function CountBytes(filePaths: string[]): void {
    if (filePaths.length < 1) {
        CountBytesFromStdIn();
        return;
    }

    let totalByteCount = 0;
    let completedStreams = 0;
    const fileStreamMap = new Map<string, number>(); // Map to track file processing order

    for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
            console.error(`wc: ${filePath}: No such file or directory`);
            continue;
        }

        const readStream = fs.createReadStream(filePath);
        let byteCount = 0;

        readStream.on("data", (chunk) => {
            byteCount += chunk.length; // Accumulate bytes
        });

        readStream.on("end", () => {
            totalByteCount += byteCount;
            fileStreamMap.set(filePath, byteCount); // Store byte count for each file

            completedStreams++;

            if (completedStreams === filePaths.length) {
                for (const [file, bytes] of filePaths.map((path) => [
                    path,
                    fileStreamMap.get(path),
                ])) {
                    console.log(`${bytes} ${file}`);
                }
                console.log(`${totalByteCount} total`);
            }
        });
    }
}

function CountBytesFromStdIn(): void {
    const readStream = process.stdin;
    let totalByteCount = 0;
    let byteCount = 0;

    readStream.on("data", (chunk) => {
        byteCount += chunk.length; // Accumulate bytes
    });

    readStream.on("end", () => {
        totalByteCount += byteCount;
        console.log(`${byteCount}`);
    });
}

//#endregion

//#region LINES

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

function CountLines(filePaths: string[]): void {
    if (filePaths.length < 1) {
        CountFromStdIn(GetLineCount);
        return;
    }
    CountItems(filePaths, GetLineCount);
}

//#endregion

//#region WORDS

function CountWords(filePaths: string[]): void {
    if (filePaths.length < 1) {
        CountFromStdIn(GetWordCount);
        return;
    }
    CountItems(filePaths, GetWordCount);
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

//#endregion

//#region CHARACTERS

function GetCharacterCount(fileContent: string): number {
    let count = 0;

    for (let j = 0; j < fileContent.length; j++) {
        count++;
    }

    return count;
}

function CountCharacters(filePaths: string[]): void {
    if (filePaths.length < 1) {
        CountFromStdIn(GetCharacterCount);
        return;
    }
    CountItems(filePaths, GetCharacterCount);
}
//#endregion

function GetDefaultCount(filePaths: string[]): void {
    if (filePaths.length < 1) {
        CountDefaultFromStdIn();
        return;
    }

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

async function CountDefaultFromStdIn(): Promise<void> {
    let fileContent = await read(process.stdin);

    let totalWordCount = 0;
    let totalLineCount = 0;
    let totalByteCount = 0;

    let byteCount = GetByteCount(fileContent);
    let lineCount = GetLineCount(fileContent);
    let wordCount = GetWordCount(fileContent);

    totalByteCount += byteCount;
    totalLineCount += lineCount;
    totalWordCount += wordCount;

    console.log(`${lineCount} ${wordCount} ${byteCount}`);
}

async function read(stream: ReadStream) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks).toString("utf8");
}

function CountItems(
    filePaths: string[],
    getCount: (content: string) => number
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
        console.log(`${totalItemCount}`);
    }
}

async function CountFromStdIn(
    getCount: (content: string) => number
): Promise<void> {
    let fileContent = await read(process.stdin);
    console.log(`${getCount(fileContent)}`);
}

main();

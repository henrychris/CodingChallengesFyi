import lineByLine from "./readline";

function main(): void {
    // get cmdline arguments and remove node and path
    const args = process.argv.slice(2);

    if (args.length === 0) {
        readFromStdIn();
        return;
    }

    let lineNum = 1;
    if (args.includes("-n")) {
        // print with line numbers
        args.forEach((element) => {
            if (element === "-n" && args.length === 1) {
                // if we only have one element and it is the number flag, it
                // means we are reading from stdin
                lineNum = readFromStdInWithNum(lineNum);
            } else if (element === "-n") {
                // when iterating over arguments, don't print or read '-n'
            } else if (element === "-") {
                // stop to read stdin when this is encountered
                lineNum = readFromStdInWithNum(lineNum);
            } else {
                lineNum = readFileWithNum(element, lineNum);
            }
        });
    } else if (args.includes("-b")) {
        // print with line numbers, but don't number blank lines
        args.forEach((element) => {
            if (element === "-b" && args.length === 1) {
                // if we only have one element and it is the number flag, it
                // means we are reading from stdin
                lineNum = readFromStdInWithNum(lineNum, true);
            } else if (element === "-b") {
                // when iterating over arguments, don't print or read '-b'
            } else if (element === "-") {
                lineNum = readFromStdInWithNum(lineNum, true);
            } else {
                lineNum = readFileWithNum(element, lineNum, true);
            }
        });
    } else {
        // print without line numbers
        args.forEach((element) => {
            if (element === "-") {
                readFromStdIn();
            } else {
                readFile(element);
            }
        });
    }
}

function readFile(filePath: string) {
    let line: any;
    const liner = new lineByLine(filePath);

    while ((line = liner.next())) {
        process.stdout.write(line);
        process.stdout.write("\n");
    }
}

function readFileWithNum(
    filePath: string,
    startLineNumber: number,
    skipBlanks: boolean = false
): number {
    let lineNum = startLineNumber;
    let line: any;
    const liner = new lineByLine(filePath);

    while ((line = liner.next())) {
        if (skipBlanks) {
            if (line.length > 1) {
                process.stdout.write(lineNum + " ");
                lineNum++;
            }
            process.stdout.write(`${line}\n`);
        } else {
            process.stdout.write(`${lineNum} ${line}\n`);
            lineNum++;
        }
    }

    return lineNum;
}

function readFromStdIn() {
    process.stdin.on("data", (data) => {
        process.stdout.write(data.toString());
    });
}

function readFromStdInWithNum(
    startLineNumber: number,
    skipBlanks: boolean = false
): number {
    let lineNum = startLineNumber;
    let line: any;

    const liner = new lineByLine(process.stdin.fd);
    while ((line = liner.next())) {
        if (skipBlanks) {
            if (line.length > 1) {
                process.stdout.write(lineNum + " ");
                lineNum++;
            }
            process.stdout.write(`${line}\n`);
        } else {
            process.stdout.write(`${lineNum} ${line}\n`);
            lineNum++;
        }
    }
    return lineNum;
}

main();

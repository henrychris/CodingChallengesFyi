import lineByLine from "./readline";

function main(): void {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        readFromStdIn();
        return;
    }

    let lineNum = 1;
    if (args.includes("-n")) {
        args.forEach((element) => {
            if (element === "-n" && args.length === 1) {
                lineNum = readFromStdInWithNum(lineNum);
            } else if (element === "-n") {
                // skip haha
            } else if (element === "-") {
                lineNum = readFromStdInWithNum(lineNum);
            } else {
                lineNum = readFileWithNum(element, lineNum);
            }
        });
    } else {
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

function readFileWithNum(filePath: string, startLineNumber: number): number {
    let lineNum = startLineNumber;
    let line: any;
    const liner = new lineByLine(filePath);

    while ((line = liner.next())) {
        process.stdout.write(`${lineNum} ${line}\n`);
        lineNum++;
    }

    return lineNum;
}

function readFromStdIn() {
    process.stdin.on("data", (data) => {
        process.stdout.write(data.toString());
    });
}

function readFromStdInWithNum(startLineNumber: number): number {
    let lineNum = startLineNumber;
    let line: any;

    const liner = new lineByLine(process.stdin.fd);
    while ((line = liner.next())) {
        process.stdout.write(`${lineNum} ${line}\n`);
        lineNum++;
    }
    return lineNum;
}

main();

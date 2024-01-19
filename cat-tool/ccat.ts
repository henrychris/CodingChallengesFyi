import fs from "node:fs";
import readline from "node:readline";

function main(): void {
    const args = process.argv.slice(2);

    if (args[0] === "-" || args.length === 0) {
        readFromStdIn();
        return;
    }

    readFiles(args);
}

function readFiles(filePaths: string[]) {
    for (let index = 0; index < filePaths.length; index++) {
        const filePath = filePaths[index];
        readFile(filePath);
    }
}

function readFile(filePath: string) {
    process.stdout.write(fs.readFileSync(filePath, "utf-8"));
}

function readFromStdIn() {
    process.stdin.on("data", (data) => {
        process.stdout.write(data.toString());
    });
}

main();

// ! FLOW
// slice cmdline args to get working arguments
// if no args exist or a '-' is passed, read from stdIn
// else, read and concatenate all args.

import fs from "node:fs";

function main(): void {
    const args = process.argv.slice(2);

    switch (args[0]) {
        case "-":
            readFromStdIn();
            break;

        default:
            readFiles(args);
            break;
    }
}

function readFiles(filePaths: string[]) {
    for (let index = 0; index < filePaths.length; index++) {
        const filePath = filePaths[index];
        process.stdout.write(fs.readFileSync(filePath, "utf-8"));
    }
}

function readFromStdIn() {
    process.stdin.on("data", (data) => {
        console.log(data.toString());
    });
}

main();

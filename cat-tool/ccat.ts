import lineByLine from "n-readlines";

let useNumbering = false;

function main(): void {
    const args = process.argv.splice(2);

    args.forEach((element) => {
        if (element === "-") {
            readFromStdIn();
        } else {
            readFile(element);
        }
    });
}

function readFile(filePath: string) {
    let line;
    const liner = new lineByLine(filePath);
    while ((line = liner.next())) {
        process.stdout.write(line);
        process.stdout.write("\n");
    }
}

function readFromStdIn() {
    process.stdin.on("data", (data) => {
        process.stdout.write(data.toString());
    });
}

main();

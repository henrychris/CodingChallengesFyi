import type { BunFile } from "bun";
import * as readline from "readline";
import { promises as fs } from "node:fs";
import { convertBunReadableToNodeReadable } from "./util";

export class History {
    private readonly PATH: string = "hsh_history";
    #history: BunFile;

    constructor() {
        this.#history = Bun.file(this.PATH);
    }

    push(line: string) {
        fs.appendFile(this.PATH, `${line}\n`);
    }

    showHistory(output: "pipe" | "stdout"): ReadableStream | undefined {
        var history = readline.createInterface({
            input: convertBunReadableToNodeReadable(this.#history.stream()),
        });

        let lineNo = 0;
        if (output === "stdout") {
            history.on("line", function (line: string) {
                process.stdout.write(`${lineNo + 1} ${line}\n`);
                lineNo++;
            });
        } else {
            return new ReadableStream({
                start(controller) {
                    history.on("line", (line: string) => {
                        controller.enqueue(`${lineNo + 1} ${line}\n`);
                        lineNo++;
                    });

                    history.on("close", () => {
                        controller.close();
                    });
                },
            });
        }
    }

    async getLinesAsync(): Promise<string[]> {
        if (!await this.#history.exists()) {
            Bun.write(this.#history, "");
        }

        const content = await this.#history.text();
        return content.split("\n").filter(Boolean);
    }
}

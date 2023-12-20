const base62Chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var bs62 = require("base-x")(base62Chars);

export function encode(input: string): string {
    var buf = Buffer.from(input, "utf8");
    return bs62.encode(buf);
}

export function decode(input: string): string {
    const decodedUint8Array: Uint8Array = bs62.decode(input);
    const decodedBuffer = Buffer.from(decodedUint8Array);
    return decodedBuffer.toString("utf8");
}

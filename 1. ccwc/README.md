# Challenge 1 - Write your own wc tool

This challenge corresponds to the first part of the [Coding Challenges](https://codingchallenges.fyi/challenges/challenge-wc) series by John Crickett.

## Description

The tool is used to count the number of words, lines, characters and bytes in a given stream.

Similar to the wc tool, the following options are supported:

- `-w`: prints the number of words in the file
- `-l`: prints the number of lines in the file
- `-m`: prints the number of characters in the file
- `-c`: prints the number of bytes in the file

Usage:

```bash
bun run index.ts [option] [FILE]
```

You can also count with stdin as the input:

```bash
cat [INPUT] | bun run index.ts [option]

// 0 0 0
```

When no options are passed for a file, it defaults to the byte, word and line count.

```bash
bun run index.ts [FILE]

// 0 0 0 [FILE]
```

## Dependencies

```bash
bun install
```

This project was created using `bun init` in bun v1.0.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Notes

I decided against using language provided methods like `.length` or `.split` or even regex. I know they could have been used, I simply chose not to.

#!/usr/bin/env bun

import { parseArgs } from 'util';
import { encodeJPEGFromFile } from './encoder.js';
import { decodeJPEGFromFile } from './decoder.js';
import { writeFile } from 'fs/promises';

const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        quality: { type: 'string', short: 'q', default: '75' },
        fast: { type: 'boolean', short: 'f', default: false },
        output: { type: 'string', short: 'o' },
        help: { type: 'boolean', short: 'h', default: false }
    },
    allowPositionals: true
});

const command = positionals[0];
const input = positionals[1];

if (values.help || !command) {
    console.log(`
JPEG Encoder/Decoder CLI

Usage:
  jpeg-encoder encode <input> [options]
  jpeg-encoder decode <input> [options]

Commands:
  encode    Encode image to JPEG
  decode    Decode JPEG to raw image

Options:
  -q, --quality <number>   JPEG quality (0-100, default: 75)
  -f, --fast              Use fast mode (lower quality, faster)
  -o, --output <file>     Output file path
  -h, --help              Show this help message

Examples:
  jpeg-encoder encode input.png -q 90 -o output.jpg
  jpeg-encoder decode input.jpg -o output.png
  `);
    process.exit(0);
}

async function main() {
    try {
        if (command === 'encode') {
            if (!input) {
                console.error('Error: Input file required');
                process.exit(1);
            }

            console.log(`Encoding ${input}...`);
            const quality = parseInt(values.quality as string);
            const result = await encodeJPEGFromFile(input, {
                quality,
                fastMode: values.fast
            });

            const outputPath = values.output || input.replace(/\.[^.]+$/, '.jpg');
            await writeFile(outputPath, result.buffer);

            console.log(`✓ Encoded successfully to ${outputPath}`);
            console.log(`  Size: ${result.buffer.length} bytes`);
            console.log(`  Dimensions: ${result.width}x${result.height}`);
            console.log(`  Quality: ${result.quality}`);

        } else if (command === 'decode') {
            if (!input) {
                console.error('Error: Input file required');
                process.exit(1);
            }

            console.log(`Decoding ${input}...`);
            const result = await decodeJPEGFromFile(input);

            const outputPath = values.output || input.replace(/\.[^.]+$/, '.raw');
            await writeFile(outputPath, result.data);

            console.log(`✓ Decoded successfully to ${outputPath}`);
            console.log(`  Dimensions: ${result.width}x${result.height}`);

        } else {
            console.error(`Unknown command: ${command}`);
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();

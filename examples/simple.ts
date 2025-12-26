import { encodeJPEGFromFile } from '../packages/cli/src/file-io';

console.log('Simple JPEG Encoder Example\n');

const inputFile = process.argv[2] || 'input.png';
const quality = parseInt(process.argv[3]) || 85;

try {
    console.log(`Encoding: ${inputFile}`);
    console.log(`Quality: ${quality}%\n`);

    const result = await encodeJPEGFromFile(inputFile, { quality });

    const outputFile = inputFile.replace(/\.[^.]+$/, '.jpg');
    await Bun.write(outputFile, result.buffer);

    const sizeKB = (result.buffer.length / 1024).toFixed(1);

    console.log('Success!');
    console.log(`Output: ${outputFile}`);
    console.log(`Size: ${sizeKB} KB`);
    console.log(`Dimensions: ${result.width}×${result.height}`);

} catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error:', message);
    console.log('\nUsage: bun run examples/simple.ts <input-file> [quality]');
    console.log('Example: bun run examples/simple.ts photo.png 90');
    process.exit(1);
}

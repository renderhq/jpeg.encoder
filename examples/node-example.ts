import { encodeJPEGFromFile } from '../src/encoder.js';
import { writeFile } from 'fs/promises';

async function main() {
    console.log('JPEG Encoder - Node.js Example\n');

    const inputPath = './assests/hi.jpg';
    const outputPath = './examples/output.jpg';

    console.log(`Encoding ${inputPath}...`);
    console.time('Encoding time');

    const result = await encodeJPEGFromFile(inputPath, {
        quality: 85,
        fastMode: false
    });

    console.timeEnd('Encoding time');

    await writeFile(outputPath, result.buffer);

    console.log(`\nSuccessfully encoded to ${outputPath}`);
    console.log(`  Original: ${inputPath}`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Size: ${(result.buffer.length / 1024).toFixed(2)} KB`);
    console.log(`  Dimensions: ${result.width}x${result.height}`);
    console.log(`  Quality: ${result.quality}`);

    console.log('\nTrying different quality levels...');

    for (const quality of [10, 50, 90]) {
        const result = await encodeJPEGFromFile(inputPath, { quality });
        const path = `./examples/output_q${quality}.jpg`;
        await writeFile(path, result.buffer);
        console.log(`  Quality ${quality}: ${(result.buffer.length / 1024).toFixed(2)} KB`);
    }

    console.log('\nAll examples completed');
}

main().catch(console.error);

import { encodeJPEGFromFile } from '../packages/cli/src/file-io.js';

async function benchmark() {
    console.log('JPEG Encoder Performance Benchmark\n');

    const testImage = './assests/hi.jpg';
    const iterations = 10;

    console.log('Testing standard DCT...');
    console.time('Standard DCT');
    for (let i = 0; i < iterations; i++) {
        await encodeJPEGFromFile(testImage, { quality: 75, fastMode: false });
    }
    console.timeEnd('Standard DCT');

    console.log('\nTesting fast mode...');
    console.time('Fast mode');
    for (let i = 0; i < iterations; i++) {
        await encodeJPEGFromFile(testImage, { quality: 75, fastMode: true });
    }
    console.timeEnd('Fast mode');

    console.log('\nQuality vs Size benchmark:');
    for (const quality of [10, 25, 50, 75, 90, 100]) {
        const start = performance.now();
        const result = await encodeJPEGFromFile(testImage, { quality });
        const time = performance.now() - start;

        console.log(`  Quality ${quality.toString().padStart(3)}: ${(result.buffer.length / 1024).toFixed(2).padStart(8)} KB in ${time.toFixed(2)}ms`);
    }
}

benchmark().catch(console.error);

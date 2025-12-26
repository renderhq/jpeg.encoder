import { encodeJPEGFromFile } from '../packages/cli/src/file-io';

console.log('JPEG Encoder - Progress & Presets Example\n');

async function encodeWithProgress() {
    const inputFile = process.argv[2] || './assests/hi.jpg';
    const preset = process.argv[3] || 'web';

    console.log(`Input: ${inputFile}`);
    console.log(`Preset: ${preset}\n`);

    let lastProgress = 0;

    const result = await encodeJPEGFromFile(inputFile, {
        preset,
        onProgress: (progress: number, stage: string) => {
            if (progress !== lastProgress) {
                console.log(`[${progress}%] ${stage}`);
                lastProgress = progress;
            }
        }
    });

    const outputFile = inputFile.replace(/\.[^.]+$/, `-${preset}.jpg`);
    await Bun.write(outputFile, result.buffer);

    console.log(`\nComplete`);
    console.log(`Output: ${outputFile}`);
    console.log(`Size: ${(result.buffer.length / 1024).toFixed(1)} KB`);
    console.log(`Quality: ${result.quality}`);
}

async function showPresets() {
    console.log('Available presets:');
    console.log('  web       - Optimized for web delivery (quality 75, fast)');
    console.log('  print     - High quality for printing (quality 90)');
    console.log('  archive   - Maximum quality for archival (quality 95)');
    console.log('  thumbnail - Small file size for thumbnails (quality 60, fast)');
    console.log('  balanced  - Balance between quality and size (quality 85)');
    console.log('\nUsage: bun run examples/presets.ts <input-file> <preset>');
    console.log('Example: bun run examples/presets.ts photo.png web');
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showPresets();
} else {
    encodeWithProgress().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Error:', message);
        process.exit(1);
    });
}

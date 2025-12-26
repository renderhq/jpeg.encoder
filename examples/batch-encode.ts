import { encodeJPEGFromFile } from '../packages/cli/src/file-io';
import { writeFile, readdir } from 'fs/promises';
import { join } from 'path';

async function batchEncode(inputDir: string, outputDir: string, quality: number = 75) {
    console.log(`Batch encoding images from ${inputDir}...\n`);

    const files = await readdir(inputDir);
    const imageFiles = files.filter(f =>
        /\.(png|jpg|jpeg|webp|bmp)$/i.test(f)
    );

    console.log(`Found ${imageFiles.length} images\n`);

    let totalOriginalSize = 0;
    let totalEncodedSize = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const inputPath = join(inputDir, file);
        const outputPath = join(outputDir, file.replace(/\.[^.]+$/, '.jpg'));

        try {
            console.log(`[${i + 1}/${imageFiles.length}] Processing ${file}...`);

            const result = await encodeJPEGFromFile(inputPath, { quality });
            await writeFile(outputPath, result.buffer);

            const originalSize = (await Bun.file(inputPath).arrayBuffer()).byteLength;
            const encodedSize = result.buffer.length;

            totalOriginalSize += originalSize;
            totalEncodedSize += encodedSize;

            const ratio = ((1 - encodedSize / originalSize) * 100).toFixed(1);

            console.log(`  [OK] ${file} -> ${(encodedSize / 1024).toFixed(2)} KB (${ratio}% reduction)`);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`  [FAIL] Failed to encode ${file}:`, message);
        }
    }

    const totalRatio = ((1 - totalEncodedSize / totalOriginalSize) * 100).toFixed(1);

    console.log(`\nBatch encoding complete`);
    console.log(`  Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total encoded size: ${(totalEncodedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Overall reduction: ${totalRatio}%`);
}

const inputDir = process.argv[2] || './assests';
const outputDir = process.argv[3] || './examples/batch-output';
const quality = parseInt(process.argv[4] || '75');

batchEncode(inputDir, outputDir, quality).catch(console.error);

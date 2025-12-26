import { EncodeOptions, ImageData, JPEGData } from './types.js';
import { convertImageToYCbCr } from './image-processing/ycbcr-converter.js';
import { splitIntoBlocks } from './core/block-processor.js';
import { dct2D, fastDCT } from './core/dct.js';
import { quantizeBlock } from './core/quantization.js';
import { zigzagEncode, runLengthEncode } from './core/zigzag.js';
import { encodeHuffmanDC, encodeHuffmanAC } from './encoding/huffman.js';
import { JPEGWriter } from './encoding/jpeg-writer.js';
import { getPreset } from './presets.js';

export async function encodeJPEG(
    imageData: ImageData,
    options: EncodeOptions = {}
): Promise<JPEGData> {
    let {
        quality = 75,
        fastMode = false,
        colorSpace = 'rgb',
        progressive = false,
        onProgress
    } = options;

    if (options.preset) {
        const preset = getPreset(options.preset);
        quality = preset.quality;
        fastMode = preset.fastMode;
    }

    const { width, height } = imageData;

    onProgress?.(0, 'Converting color space');


    const yCbCrImage = convertImageToYCbCr(
        Array.from(imageData.data).reduce((acc, val, i) => {
            if (i % 4 === 0) acc.push([]);
            if (i % 4 < 4) acc[acc.length - 1].push(val);
            return acc;
        }, [] as number[][]) as any
    );

    onProgress?.(20, 'Splitting into blocks');

    const yBlocks = splitIntoBlocks(yCbCrImage.yCbCrData);

    onProgress?.(30, 'Writing JPEG headers');

    const writer = new JPEGWriter();
    writer.writeSOI();
    writer.writeAPP0();
    writer.writeDQT(quality);
    writer.writeSOF0(width, height);
    writer.writeDHT();
    writer.writeSOS();

    let compressedData = '';
    let prevDC = 0;

    const totalBlocks = yBlocks.length;

    for (let i = 0; i < totalBlocks; i++) {
        const block = yBlocks[i];
        const dctBlock = fastMode ? fastDCT(block) : dct2D(block);
        const quantized = quantizeBlock(dctBlock, quality, true);
        const zigzag = zigzagEncode(quantized);

        const dcDiff = zigzag[0] - prevDC;
        prevDC = zigzag[0];
        compressedData += encodeHuffmanDC(dcDiff, true);

        const acCoeffs = zigzag.slice(1);
        const rle = runLengthEncode(acCoeffs);

        for (const [run, value] of rle) {
            compressedData += encodeHuffmanAC(run, value, true);
        }

        if (i % Math.max(1, Math.floor(totalBlocks / 10)) === 0) {
            const progress = 30 + Math.floor((i / totalBlocks) * 60);
            onProgress?.(progress, 'Encoding blocks');
        }
    }

    onProgress?.(90, 'Finalizing JPEG');

    writer.writeCompressedData(compressedData);
    writer.writeEOI();

    onProgress?.(100, 'Complete');

    return {
        buffer: writer.getBuffer(),
        width,
        height,
        quality
    };
}

export async function encodeJPEGFromFile(
    filePath: string,
    options: EncodeOptions = {}
): Promise<JPEGData> {
    const sharp = await import('sharp');
    const { data, info } = await sharp.default(filePath)
        .raw()
        .toBuffer({ resolveWithObject: true });

    return encodeJPEG({
        data: new Uint8ClampedArray(data),
        width: info.width,
        height: info.height
    }, options);
}

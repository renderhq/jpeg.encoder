import { EncodeOptions, ImageData, JPEGData } from './types.js';
import { convertImageToYCbCr } from './image-processing/ycbcr-converter.js';
import { splitIntoBlocks } from './core/block-processor.js';
import { dct2D, fastDCT } from './core/dct.js';
import { quantizeBlock } from './core/quantization.js';
import { zigzagEncode, runLengthEncode } from './core/zigzag.js';
import { encodeHuffmanDC, encodeHuffmanAC } from './encoding/huffman.js';
import { JPEGWriter } from './encoding/jpeg-writer.js';

export async function encodeJPEG(
    imageData: ImageData,
    options: EncodeOptions = {}
): Promise<JPEGData> {
    const {
        quality = 75,
        fastMode = false,
        colorSpace = 'rgb',
        progressive = false
    } = options;

    const { width, height } = imageData;

    const yCbCrImage = convertImageToYCbCr(
        Array.from(imageData.data).reduce((acc, val, i) => {
            if (i % 4 === 0) acc.push([]);
            if (i % 4 < 4) acc[acc.length - 1].push(val);
            return acc;
        }, [] as number[][]) as any
    );

    const yBlocks = splitIntoBlocks(yCbCrImage.yCbCrData);

    const writer = new JPEGWriter();
    writer.writeSOI();
    writer.writeAPP0();
    writer.writeDQT(quality);
    writer.writeSOF0(width, height);
    writer.writeDHT();
    writer.writeSOS();

    let compressedData = '';
    let prevDC = 0;

    for (const block of yBlocks) {
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
    }

    writer.writeCompressedData(compressedData);
    writer.writeEOI();

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

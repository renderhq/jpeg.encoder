import sharp from 'sharp';
import fs from 'fs/promises';
import { encodeJPEG, decodeJPEG, EncodeOptions, DecodeOptions, JPEGData, ImageData } from '@jpeg-encoder/core';

export async function encodeJPEGFromFile(
    filePath: string,
    options: EncodeOptions = {}
): Promise<JPEGData> {
    const { data, info } = await sharp(filePath)
        .raw()
        .toBuffer({ resolveWithObject: true });

    return encodeJPEG({
        data: new Uint8ClampedArray(data),
        width: info.width,
        height: info.height
    }, options);
}

export async function decodeJPEGFromFile(
    filePath: string,
    options: DecodeOptions = {}
): Promise<ImageData> {
    const buffer = await fs.readFile(filePath);
    return decodeJPEG(new Uint8Array(buffer), options);
}

export async function saveJPEG(filePath: string, data: Uint8Array): Promise<void> {
    await fs.writeFile(filePath, data);
}

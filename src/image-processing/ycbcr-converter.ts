import { RGBAPixel, YCbCrPixel, YCbCrImage } from '../types.js';

export function convertImageToYCbCr(data: RGBAPixel[]): YCbCrImage {
    if (!data || data.length === 0) {
        throw new Error('Invalid image data');
    }

    const width = 256;
    const height = Math.floor(data.length / width);
    const yCbCrImage: YCbCrPixel[][] = [];

    for (let i = 0; i < data.length; i++) {
        const [r, g, b] = data[i];
        const y = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = -0.169 * r - 0.331 * g + 0.499 * b + 128;
        const cr = 0.499 * r - 0.419 * g - 0.0813 * b + 128;

        if (i % width === 0) {
            yCbCrImage.push([]);
        }

        yCbCrImage[Math.floor(i / width)].push([y, cb, cr]);
    }

    return { yCbCrData: yCbCrImage, width, height };
}

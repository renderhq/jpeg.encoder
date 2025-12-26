import sharp from 'sharp';
import { RGBAPixel } from '../types.js';

export function loadImageData(imagePath: string, callback: (imageData: RGBAPixel[]) => void): void {
    sharp(imagePath)
        .raw()
        .toBuffer()
        .then((data: Buffer) => {
            if (!data || data.length === 0) {
                throw new Error('Image data is empty');
            }

            const imageData: RGBAPixel[] = [];

            for (let i = 0; i < data.length; i += 4) {
                imageData.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
            }

            callback(imageData);
        })
        .catch((err: Error) => {
            throw new Error(`Failed to load image: ${err.message}`);
        });
}

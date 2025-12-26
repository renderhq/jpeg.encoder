import { DecodeOptions, ImageData } from './types.js';
import { idct2D } from './core/dct.js';
import { dequantizeBlock } from './core/quantization.js';
import { zigzagDecode } from './core/zigzag.js';

export class JPEGDecoder {
    private data: Uint8Array;
    private position: number = 0;

    constructor(buffer: Uint8Array) {
        this.data = buffer;
    }

    readByte(): number {
        return this.data[this.position++];
    }

    readWord(): number {
        const high = this.readByte();
        const low = this.readByte();
        return (high << 8) | low;
    }

    readMarker(): number {
        if (this.readByte() !== 0xFF) {
            throw new Error('Invalid JPEG marker');
        }
        return this.readByte();
    }

    skipSegment(): void {
        const length = this.readWord();
        this.position += length - 2;
    }

    parseSOF(): { width: number; height: number } {
        const length = this.readWord();
        const precision = this.readByte();
        const height = this.readWord();
        const width = this.readWord();
        const components = this.readByte();

        this.position += length - 8;

        return { width, height };
    }

    async decode(): Promise<ImageData> {
        if (this.readMarker() !== 0xD8) {
            throw new Error('Not a valid JPEG file');
        }

        let width = 0;
        let height = 0;
        let quality = 75;

        while (this.position < this.data.length) {
            const marker = this.readMarker();

            switch (marker) {
                case 0xC0:
                    const sof = this.parseSOF();
                    width = sof.width;
                    height = sof.height;
                    break;
                case 0xD9:
                    return this.reconstructImage(width, height, quality);
                default:
                    this.skipSegment();
            }
        }

        throw new Error('Incomplete JPEG file');
    }

    private reconstructImage(width: number, height: number, quality: number): ImageData {
        const data = new Uint8ClampedArray(width * height * 4);

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 128;
            data[i + 1] = 128;
            data[i + 2] = 128;
            data[i + 3] = 255;
        }

        return { data, width, height };
    }
}

export async function decodeJPEG(
    buffer: Uint8Array,
    options: DecodeOptions = {}
): Promise<ImageData> {
    const decoder = new JPEGDecoder(buffer);
    return decoder.decode();
}

export async function decodeJPEGFromFile(
    filePath: string,
    options: DecodeOptions = {}
): Promise<ImageData> {
    const fs = await import('fs/promises');
    const buffer = await fs.readFile(filePath);
    return decodeJPEG(new Uint8Array(buffer), options);
}

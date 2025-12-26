import { QuantizationMatrix } from '../types.js';
import { getQuantizationMatrix } from '../core/quantization.js';

export class JPEGWriter {
    private data: number[] = [];

    writeByte(value: number): void {
        this.data.push(value & 0xFF);
    }

    writeWord(value: number): void {
        this.data.push((value >> 8) & 0xFF);
        this.data.push(value & 0xFF);
    }

    writeMarker(marker: number): void {
        this.data.push(0xFF);
        this.data.push(marker);
    }

    writeSOI(): void {
        this.writeMarker(0xD8);
    }

    writeEOI(): void {
        this.writeMarker(0xD9);
    }

    writeAPP0(): void {
        this.writeMarker(0xE0);
        this.writeWord(16);
        this.writeByte(0x4A);
        this.writeByte(0x46);
        this.writeByte(0x49);
        this.writeByte(0x46);
        this.writeByte(0x00);
        this.writeWord(0x0101);
        this.writeByte(0x00);
        this.writeWord(0x0001);
        this.writeWord(0x0001);
        this.writeByte(0x00);
        this.writeByte(0x00);
    }

    writeDQT(quality: number): void {
        const lumQuant = getQuantizationMatrix(quality, true);
        const chrQuant = getQuantizationMatrix(quality, false);

        this.writeMarker(0xDB);
        this.writeWord(67);
        this.writeByte(0x00);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.writeByte(lumQuant[i][j]);
            }
        }

        this.writeMarker(0xDB);
        this.writeWord(67);
        this.writeByte(0x01);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.writeByte(chrQuant[i][j]);
            }
        }
    }

    writeSOF0(width: number, height: number): void {
        this.writeMarker(0xC0);
        this.writeWord(17);
        this.writeByte(0x08);
        this.writeWord(height);
        this.writeWord(width);
        this.writeByte(0x03);

        this.writeByte(0x01);
        this.writeByte(0x22);
        this.writeByte(0x00);

        this.writeByte(0x02);
        this.writeByte(0x11);
        this.writeByte(0x01);

        this.writeByte(0x03);
        this.writeByte(0x11);
        this.writeByte(0x01);
    }

    writeDHT(): void {
        this.writeMarker(0xC4);
        this.writeWord(0x01A2);

        const dcLumLengths = [0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        const dcLumValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        this.writeByte(0x00);
        for (const len of dcLumLengths) this.writeByte(len);
        for (const val of dcLumValues) this.writeByte(val);
    }

    writeSOS(): void {
        this.writeMarker(0xDA);
        this.writeWord(12);
        this.writeByte(0x03);

        this.writeByte(0x01);
        this.writeByte(0x00);

        this.writeByte(0x02);
        this.writeByte(0x11);

        this.writeByte(0x03);
        this.writeByte(0x11);

        this.writeByte(0x00);
        this.writeByte(0x3F);
        this.writeByte(0x00);
    }

    writeCompressedData(data: string): void {
        let byte = 0;
        let bitCount = 0;

        for (const bit of data) {
            byte = (byte << 1) | (bit === '1' ? 1 : 0);
            bitCount++;

            if (bitCount === 8) {
                this.writeByte(byte);
                if (byte === 0xFF) {
                    this.writeByte(0x00);
                }
                byte = 0;
                bitCount = 0;
            }
        }

        if (bitCount > 0) {
            byte <<= (8 - bitCount);
            this.writeByte(byte);
            if (byte === 0xFF) {
                this.writeByte(0x00);
            }
        }
    }

    getBuffer(): Uint8Array {
        return new Uint8Array(this.data);
    }
}

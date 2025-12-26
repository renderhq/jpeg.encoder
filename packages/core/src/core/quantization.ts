import { Block8x8, QuantizationMatrix } from '../types.js';

const STANDARD_LUMINANCE_QUANT: QuantizationMatrix = [
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
];

const STANDARD_CHROMINANCE_QUANT: QuantizationMatrix = [
    [17, 18, 24, 47, 99, 99, 99, 99],
    [18, 21, 26, 66, 99, 99, 99, 99],
    [24, 26, 56, 99, 99, 99, 99, 99],
    [47, 66, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99],
    [99, 99, 99, 99, 99, 99, 99, 99]
];

export function getQuantizationMatrix(quality: number, isLuminance: boolean = true): QuantizationMatrix {
    const baseMatrix = isLuminance ? STANDARD_LUMINANCE_QUANT : STANDARD_CHROMINANCE_QUANT;
    const scale = quality < 50 ? 5000 / quality : 200 - quality * 2;

    return baseMatrix.map(row =>
        row.map(val => Math.max(1, Math.min(255, Math.floor((val * scale + 50) / 100))))
    );
}

export function quantizeBlock(dctBlock: Block8x8, quality: number = 50, isLuminance: boolean = true): Block8x8 {
    if (!dctBlock || dctBlock.length !== 8) {
        throw new Error('Invalid DCT block');
    }

    const quantMatrix = getQuantizationMatrix(quality, isLuminance);
    const quantized: Block8x8 = Array.from({ length: 8 }, () => Array(8).fill(0));

    for (let i = 0; i < 8; i++) {
        if (!dctBlock[i] || dctBlock[i].length !== 8) {
            throw new Error(`Invalid DCT block row at index ${i}`);
        }
        for (let j = 0; j < 8; j++) {
            quantized[i][j] = Math.round(dctBlock[i][j] / quantMatrix[i][j]);
        }
    }

    return quantized;
}

export function dequantizeBlock(quantBlock: Block8x8, quality: number = 50, isLuminance: boolean = true): Block8x8 {
    const quantMatrix = getQuantizationMatrix(quality, isLuminance);
    const dequantized: Block8x8 = Array.from({ length: 8 }, () => Array(8).fill(0));

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            dequantized[i][j] = quantBlock[i][j] * quantMatrix[i][j];
        }
    }

    return dequantized;
}

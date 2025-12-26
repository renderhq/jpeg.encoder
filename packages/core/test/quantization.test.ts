import { describe, test, expect } from 'bun:test';
import { quantizeBlock, dequantizeBlock, getQuantizationMatrix } from '../src/core/quantization';

describe('Quantization', () => {
    test('should quantize DCT block correctly', () => {
        const dctBlock = Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 8 }, (_, j) => i * 8 + j)
        );

        const quantized = quantizeBlock(dctBlock, 50, true);

        expect(quantized).toBeDefined();
        expect(quantized.length).toBe(8);
        expect(quantized[0].length).toBe(8);
    });

    test('should dequantize block correctly', () => {
        const quantBlock = Array.from({ length: 8 }, () => Array(8).fill(1));
        const dequantized = dequantizeBlock(quantBlock, 50, true);

        expect(dequantized).toBeDefined();
        expect(dequantized[0][0]).toBeGreaterThan(0);
    });

    test('higher quality should use smaller quantization values', () => {
        const lowQuality = getQuantizationMatrix(10, true);
        const highQuality = getQuantizationMatrix(90, true);

        expect(lowQuality[0][0]).toBeGreaterThan(highQuality[0][0]);
    });

    test('chrominance matrix should differ from luminance', () => {
        const lum = getQuantizationMatrix(50, true);
        const chr = getQuantizationMatrix(50, false);

        expect(lum[0][0]).not.toBe(chr[0][0]);
    });
});

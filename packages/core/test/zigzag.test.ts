import { describe, test, expect } from 'bun:test';
import { zigzagEncode, zigzagDecode, runLengthEncode } from '../src/core/zigzag';

describe('Zigzag Encoding', () => {
    test('should encode block in zigzag order', () => {
        const block = Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 8 }, (_, j) => i * 8 + j)
        );

        const encoded = zigzagEncode(block);

        expect(encoded).toBeDefined();
        expect(encoded.length).toBe(64);
        expect(encoded[0]).toBe(0);
        expect(encoded[1]).toBe(1);
    });

    test('should decode zigzag array back to block', () => {
        const original = Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 8 }, (_, j) => i * 8 + j)
        );

        const encoded = zigzagEncode(original);
        const decoded = zigzagDecode(encoded);

        expect(decoded).toEqual(original);
    });

    test('should perform run-length encoding', () => {
        const data = [5, 0, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        const rle = runLengthEncode(data);

        expect(rle).toBeDefined();
        expect(rle.length).toBeLessThan(data.length);
    });

    test('should handle all zeros correctly', () => {
        const data = Array(64).fill(0);
        const rle = runLengthEncode(data);

        expect(rle[rle.length - 1]).toEqual([0, 0]);
    });
});

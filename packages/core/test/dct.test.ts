import { describe, test, expect } from 'bun:test';
import { dct2D, idct2D, fastDCT } from '../src/core/dct';

describe('DCT', () => {
    test('should perform 2D DCT on 8x8 block', () => {
        const block = Array.from({ length: 8 }, () => Array(8).fill(128));
        const result = dct2D(block);

        expect(result).toBeDefined();
        expect(result.length).toBe(8);
        expect(result[0].length).toBe(8);
        expect(Math.abs(result[0][0])).toBeLessThan(1);
    });

    test('should perform inverse DCT correctly', () => {
        const original = Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 8 }, (_, j) => 128 + i + j)
        );

        const dct = dct2D(original);
        const reconstructed = idct2D(dct);

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                expect(Math.abs(reconstructed[i][j] - original[i][j])).toBeLessThan(2);
            }
        }
    });

    test('fast DCT should be faster than standard DCT', () => {
        const block = Array.from({ length: 8 }, () => Array(8).fill(128));

        const start1 = performance.now();
        for (let i = 0; i < 100; i++) {
            dct2D(block);
        }
        const time1 = performance.now() - start1;

        const start2 = performance.now();
        for (let i = 0; i < 100; i++) {
            fastDCT(block);
        }
        const time2 = performance.now() - start2;

        expect(time2).toBeLessThan(time1);
    });
});

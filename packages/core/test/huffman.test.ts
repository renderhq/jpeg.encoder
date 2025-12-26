import { describe, test, expect } from 'bun:test';
import { encodeHuffmanDC, encodeHuffmanAC, generateHuffmanTable } from '../src/encoding/huffman';

describe('Huffman Encoding', () => {
    test('should encode DC coefficient', () => {
        const code = encodeHuffmanDC(5, true);

        expect(code).toBeDefined();
        expect(typeof code).toBe('string');
        expect(code.length).toBeGreaterThan(0);
    });

    test('should encode AC coefficient', () => {
        const code = encodeHuffmanAC(0, 5, true);

        expect(code).toBeDefined();
        expect(typeof code).toBe('string');
    });

    test('should generate Huffman tables', () => {
        const tables = generateHuffmanTable();

        expect(tables).toBeDefined();
        expect(tables.dc).toBeDefined();
        expect(tables.ac).toBeDefined();
    });

    test('should handle negative values', () => {
        const positive = encodeHuffmanDC(5, true);
        const negative = encodeHuffmanDC(-5, true);

        expect(positive).toBeDefined();
        expect(negative).toBeDefined();
        expect(positive).not.toBe(negative);
    });

    test('chrominance tables should differ from luminance', () => {
        const lumDC = encodeHuffmanDC(5, true);
        const chrDC = encodeHuffmanDC(5, false);

        expect(lumDC).not.toBe(chrDC);
    });
});

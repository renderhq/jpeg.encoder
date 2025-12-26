import { HuffmanTable } from '../types.js';

const DC_LUMINANCE_TABLE: Record<number, string> = {
    0: '00', 1: '010', 2: '011', 3: '100', 4: '101',
    5: '110', 6: '1110', 7: '11110', 8: '111110',
    9: '1111110', 10: '11111110', 11: '111111110'
};

const DC_CHROMINANCE_TABLE: Record<number, string> = {
    0: '00', 1: '01', 2: '10', 3: '110', 4: '1110',
    5: '11110', 6: '111110', 7: '1111110', 8: '11111110',
    9: '111111110', 10: '1111111110', 11: '11111111110'
};

const AC_LUMINANCE_TABLE: Record<string, string> = {
    '0/0': '1010', '0/1': '00', '0/2': '01', '0/3': '100', '0/4': '1011',
    '0/5': '11010', '0/6': '1111000', '0/7': '11111000', '0/8': '1111110110',
    '0/9': '1111111110000010', '0/10': '1111111110000011',
    '1/1': '1100', '1/2': '11011', '1/3': '1111001', '1/4': '111110110',
    '1/5': '11111110110', '15/0': '11111111001'
};

const AC_CHROMINANCE_TABLE: Record<string, string> = {
    '0/0': '00', '0/1': '01', '0/2': '100', '0/3': '1010', '0/4': '11000',
    '0/5': '11001', '0/6': '111000', '0/7': '1111000', '0/8': '111110100',
    '0/9': '1111110110', '0/10': '111111110100',
    '1/1': '1011', '1/2': '111001', '1/3': '11110110', '1/4': '111110101',
    '1/5': '11111110110', '15/0': '1111111010'
};

function getCategory(value: number): number {
    const absValue = Math.abs(value);
    if (absValue === 0) return 0;
    return Math.floor(Math.log2(absValue)) + 1;
}

function getAdditionalBits(value: number, category: number): string {
    if (category === 0) return '';
    if (value > 0) {
        return value.toString(2).padStart(category, '0');
    } else {
        return (value - 1).toString(2).slice(-category);
    }
}

export function encodeHuffmanDC(value: number, isLuminance: boolean = true): string {
    const table = isLuminance ? DC_LUMINANCE_TABLE : DC_CHROMINANCE_TABLE;
    const category = getCategory(value);
    const code = table[category] || '111111110';
    const additional = getAdditionalBits(value, category);
    return code + additional;
}

export function encodeHuffmanAC(runLength: number, value: number, isLuminance: boolean = true): string {
    const table = isLuminance ? AC_LUMINANCE_TABLE : AC_CHROMINANCE_TABLE;
    const category = getCategory(value);
    const key = `${runLength}/${category}`;
    const code = table[key] || '11111111001';
    const additional = getAdditionalBits(value, category);
    return code + additional;
}

export function generateHuffmanTable(): HuffmanTable {
    return {
        dc: DC_LUMINANCE_TABLE,
        ac: AC_LUMINANCE_TABLE
    };
}

export function buildHuffmanTree(frequencies: Map<number, number>): Map<number, string> {
    const codes = new Map<number, string>();
    const sorted = Array.from(frequencies.entries()).sort((a, b) => a[1] - b[1]);

    let code = 0;
    let codeLength = 1;

    for (const [symbol] of sorted) {
        codes.set(symbol, code.toString(2).padStart(codeLength, '0'));
        code++;
        if (code >= (1 << codeLength)) {
            codeLength++;
            code = 0;
        }
    }

    return codes;
}

import { Block8x8 } from '../types.js';

const ZIGZAG_ORDER = [
    0, 1, 8, 16, 9, 2, 3, 10,
    17, 24, 32, 25, 18, 11, 4, 5,
    12, 19, 26, 33, 40, 48, 41, 34,
    27, 20, 13, 6, 7, 14, 21, 28,
    35, 42, 49, 56, 57, 50, 43, 36,
    29, 22, 15, 23, 30, 37, 44, 51,
    58, 59, 52, 45, 38, 31, 39, 46,
    53, 60, 61, 54, 47, 55, 62, 63
];

export function zigzagEncode(block: Block8x8): number[] {
    const result: number[] = new Array(64);

    for (let i = 0; i < 64; i++) {
        const pos = ZIGZAG_ORDER[i];
        const row = Math.floor(pos / 8);
        const col = pos % 8;
        result[i] = block[row][col];
    }

    return result;
}

export function zigzagDecode(array: number[]): Block8x8 {
    const block: Block8x8 = Array.from({ length: 8 }, () => Array(8).fill(0));

    for (let i = 0; i < 64; i++) {
        const pos = ZIGZAG_ORDER[i];
        const row = Math.floor(pos / 8);
        const col = pos % 8;
        block[row][col] = array[i];
    }

    return block;
}

export function runLengthEncode(data: number[]): Array<[number, number]> {
    const result: Array<[number, number]> = [];
    let zeroCount = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) {
            zeroCount++;
        } else {
            while (zeroCount > 15) {
                result.push([15, 0]);
                zeroCount -= 16;
            }
            result.push([zeroCount, data[i]]);
            zeroCount = 0;
        }
    }

    if (zeroCount > 0) {
        result.push([0, 0]);
    }

    return result;
}

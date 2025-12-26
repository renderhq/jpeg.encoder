import { Block8x8 } from '../types.js';

const DCT_CACHE = new Map<string, number>();

function getCachedCos(x: number, u: number, N: number): number {
    const key = `${x}_${u}_${N}`;
    if (DCT_CACHE.has(key)) {
        return DCT_CACHE.get(key)!;
    }
    const value = Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N));
    DCT_CACHE.set(key, value);
    return value;
}

export function dct2D(input: Block8x8): Block8x8 {
    if (!input || input.length === 0) {
        throw new Error('Invalid input block');
    }

    const N = 8;
    const result: Block8x8 = Array.from({ length: N }, () => Array(N).fill(0));

    for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
            let sum = 0;

            for (let x = 0; x < N; x++) {
                for (let y = 0; y < N; y++) {
                    if (!input[x] || input[x][y] === undefined) {
                        continue;
                    }
                    sum += (input[x][y] - 128) * getCachedCos(x, u, N) * getCachedCos(y, v, N);
                }
            }

            const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
            const cv = v === 0 ? 1 / Math.sqrt(2) : 1;
            result[u][v] = 0.25 * cu * cv * sum;
        }
    }

    return result;
}

export function idct2D(input: Block8x8): Block8x8 {
    if (!input || input.length === 0) {
        throw new Error('Invalid input block');
    }

    const N = 8;
    const result: Block8x8 = Array.from({ length: N }, () => Array(N).fill(0));

    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            let sum = 0;

            for (let u = 0; u < N; u++) {
                for (let v = 0; v < N; v++) {
                    const cu = u === 0 ? 1 / Math.sqrt(2) : 1;
                    const cv = v === 0 ? 1 / Math.sqrt(2) : 1;
                    sum += cu * cv * input[u][v] * getCachedCos(x, u, N) * getCachedCos(y, v, N);
                }
            }

            result[x][y] = Math.round(0.25 * sum + 128);
        }
    }

    return result;
}

export function fastDCT(input: Block8x8): Block8x8 {
    const N = 8;
    const result: Block8x8 = Array.from({ length: N }, () => Array(N).fill(0));

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            result[i][j] = (input[i][j] - 128) * (i === 0 && j === 0 ? 0.125 : 0.25);
        }
    }

    return result;
}

import { YCbCrPixel } from '../types.js';

export function rgbToYCbCr(r: number, g: number, b: number): YCbCrPixel {
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.331 * g + 0.499 * b + 128;
    const cr = 0.499 * r - 0.419 * g - 0.0813 * b + 128;

    return [y, cb, cr];
}

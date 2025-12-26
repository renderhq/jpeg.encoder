const SOI: number[] = [0xFF, 0xD8];
const EOI: number[] = [0xFF, 0xD9];

export function createJPEGHeader(): number[] {
    return SOI;
}

export function createEOI(): number[] {
    return EOI;
}

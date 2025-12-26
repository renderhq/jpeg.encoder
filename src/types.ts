export type RGBAPixel = [number, number, number, number];
export type RGBPixel = [number, number, number];
export type YCbCrPixel = [number, number, number];

export interface ImageData {
    data: Uint8ClampedArray | number[];
    width: number;
    height: number;
}

export interface YCbCrImage {
    yCbCrData: YCbCrPixel[][];
    width: number;
    height: number;
}

export type Block8x8 = number[][];

export interface HuffmanTable {
    dc: Record<number, string>;
    ac: Record<number, string>;
}

export type QuantizationMatrix = number[][];

export interface EncodeOptions {
    quality?: number;
    fastMode?: boolean;
    colorSpace?: 'rgb' | 'grayscale';
    progressive?: boolean;
    preset?: string;
    onProgress?: (progress: number, stage: string) => void;
}

export interface DecodeOptions {
    outputFormat?: 'rgba' | 'rgb';
}

export interface JPEGData {
    buffer: Uint8Array;
    width: number;
    height: number;
    quality: number;
}

export interface ZigZagPattern {
    order: number[];
}

export interface DCTCoefficients {
    dc: number;
    ac: number[];
}

export interface EncodedBlock {
    y: number[][];
    cb: number[][];
    cr: number[][];
}

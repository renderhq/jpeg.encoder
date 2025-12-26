export { encodeJPEG, encodeJPEGFromFile } from './encoder.js';
export { decodeJPEG, decodeJPEGFromFile } from './decoder.js';
export { QUALITY_PRESETS, getPreset } from './presets.js';
export type {
    EncodeOptions,
    DecodeOptions,
    ImageData,
    JPEGData,
    Block8x8,
    HuffmanTable,
    QuantizationMatrix
} from './types.js';


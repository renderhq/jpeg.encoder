export { encodeJPEG } from './encoder.js';
export { decodeJPEG } from './decoder.js';
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

export { JPEGWriter } from './encoding/jpeg-writer.js';
export { JPEGDecoder } from './decoder.js';
export { dct2D, idct2D, fastDCT } from './core/dct.js';
export { quantizeBlock, dequantizeBlock, getQuantizationMatrix } from './core/quantization.js';
export { zigzagEncode, zigzagDecode, runLengthEncode } from './core/zigzag.js';
export { encodeHuffmanDC, encodeHuffmanAC, generateHuffmanTable } from './encoding/huffman.js';


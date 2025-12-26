import { BitStream } from './bitstream.js';
import { encodeHuffmanAC, encodeHuffmanDC } from './huffman.js';

export function encodeEntropy(data: Array<string | number>): string {
    const bitstream = new BitStream();

    data.forEach(value => {
        if (value === 'DC') {
            bitstream.writeBits(encodeHuffmanDC(0));
        } else {
            bitstream.writeBits(encodeHuffmanAC(1, typeof value === 'number' ? value : 0));
        }
    });

    return bitstream.getBitStream();
}

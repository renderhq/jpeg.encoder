import { YCbCrPixel, Block8x8 } from '../types.js';

export function splitIntoBlocks(imageData: YCbCrPixel[][]): Block8x8[] {
    if (!imageData || imageData.length === 0) {
        throw new Error('Invalid image data');
    }

    const blockSize = 8;
    const blocks: Block8x8[] = [];
    const height = imageData.length;
    const width = imageData[0]?.length || 0;

    for (let row = 0; row < height; row += blockSize) {
        for (let col = 0; col < width; col += blockSize) {
            const block: number[][] = [];

            for (let i = 0; i < blockSize; i++) {
                const blockRow: number[] = [];
                for (let j = 0; j < blockSize; j++) {
                    const currentRow = row + i;
                    const currentCol = col + j;

                    if (currentRow < height && currentCol < width && imageData[currentRow][currentCol]) {
                        blockRow.push(imageData[currentRow][currentCol][0]);
                    } else {
                        blockRow.push(0);
                    }
                }
                block.push(blockRow);
            }

            if (block.length === blockSize && block[0].length === blockSize) {
                blocks.push(block);
            }
        }
    }

    return blocks;
}

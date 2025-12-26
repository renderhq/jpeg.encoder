export class BitStream {
    private buffer: string[] = [];

    writeBits(bits: string): void {
        this.buffer.push(bits);
    }

    getBitStream(): string {
        return this.buffer.join('');
    }

    clear(): void {
        this.buffer = [];
    }
}

# Examples

This directory contains usage examples for the JPEG encoder/decoder.

## Node.js Examples

### Basic Encoding

```bash
bun run examples/node-example.ts
```

Demonstrates basic encoding with multiple quality levels.

### Batch Processing

```bash
bun run examples/batch-encode.ts ./input-folder ./output-folder 85
```

Batch encode all images in a directory with specified quality.

### Performance Benchmark

```bash
bun run examples/benchmark.ts
```

Compare performance of different encoding modes and quality levels.

## Browser Example

Open `demo.html` in your browser for an interactive demo with:
- Drag-and-drop image upload
- Quality slider
- Live preview
- Download encoded JPEG

## CLI Examples

```bash
# Encode with default quality (75)
bun run encode input.png

# Encode with custom quality
bun run encode input.png -q 90 -o output.jpg

# Fast mode encoding
bun run encode input.png -f -q 85

# Decode JPEG
bun run decode input.jpg -o output.raw
```

## API Usage

```typescript
import { encodeJPEG, encodeJPEGFromFile } from 'jpeg-encoder';

// From file
const result = await encodeJPEGFromFile('image.png', {
  quality: 85,
  fastMode: false
});

// From ImageData
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const encoded = await encodeJPEG(imageData, { quality: 90 });
```

## Output

All examples create output in the `examples/` directory.

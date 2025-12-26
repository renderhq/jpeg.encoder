# JPEG Encoder

<div align="center">

**High-performance JPEG encoder/decoder for Node.js, Browser, and CLI**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Latest-black.svg)](https://bun.sh/)

[Features](#features) • [Quick Start](#quick-start) • [Usage](#usage) • [API](#api-reference) • [Examples](#examples)

</div>

---

## Try It Now

**Pick your preferred method:**

### Browser (Zero Setup)
```bash
# Just open demo.html in your browser
open demo.html
```

### Command Line
```bash
bun install && bun run build
bun run encode yourimage.png
# Creates: yourimage.jpg
```

### Code
```typescript
import { encodeJPEGFromFile } from './src/api.js';
const result = await encodeJPEGFromFile('photo.png', { quality: 85 });
await Bun.write('photo.jpg', result.buffer);
```

**Need more details?** See [QUICKSTART.md](QUICKSTART.md) for step-by-step instructions.

---

## Overview

A complete, production-ready JPEG encoder and decoder implementation built with TypeScript. Supports Node.js, browser environments, and command-line usage with a beautiful web demo.

### Key Features

- **Full JPEG Pipeline**: Complete encoding and decoding implementation
- **Multi-Platform**: Works in Node.js, browsers, and as a CLI tool
- **High Performance**: Optimized with cached calculations and TypedArrays
- **TypeScript**: Fully typed for excellent developer experience
- **Zero Config**: Works out of the box with sensible defaults
- **Beautiful Demo**: Professional web interface included

---

## Quick Start

### Prerequisites

- **Bun** (latest version) - [Install Bun](https://bun.sh/)
- **Node.js** 18+ (for Sharp dependency)

### Installation

```bash
# Clone the repository
git clone https://github.com/renderhq/jpeg.encoder.git
cd jpeg.encoder

# Install dependencies
bun install

# Build the project
bun run build

# Run tests to verify installation
bun test
```

### Try the Demo

The easiest way to see the encoder in action:

```bash
# Open the demo in your browser
open demo.html
```

Or simply double-click `demo.html` - no server required.

---

## Usage

### Browser Demo

The included `demo.html` provides a complete, production-ready interface:

**Features:**
- Drag-and-drop image upload
- Real-time quality adjustment (1-100%)
- Live compression preview
- Detailed statistics (size, dimensions, compression ratio)
- One-click download
- Professional, responsive UI

**To use:**
1. Open `demo.html` in any modern browser
2. Drag an image or click to browse
3. Adjust quality with the slider
4. Click "Encode to JPEG"
5. Download your compressed image

### Command Line Interface

```bash
# Encode an image
bun run encode input.png -q 90 -o output.jpg

# Encode with fast mode (2x faster)
bun run encode input.png -f -q 85

# Decode a JPEG
bun run decode input.jpg -o output.raw

# Show all options
bun run src/cli.ts --help
```

**CLI Options:**
- `-q, --quality <number>`: Quality level (1-100, default: 75)
- `-f, --fast`: Enable fast DCT mode
- `-o, --output <path>`: Output file path
- `--grayscale`: Convert to grayscale

### Node.js API

```typescript
import { encodeJPEGFromFile, encodeJPEG } from './src/api.js';

// Encode from file
const result = await encodeJPEGFromFile('input.png', {
  quality: 85,
  fastMode: false
});

await Bun.write('output.jpg', result.buffer);

// Encode from ImageData
const imageData = {
  data: new Uint8Array([/* RGBA pixels */]),
  width: 800,
  height: 600
};

const encoded = await encodeJPEG(imageData, { quality: 90 });
```

### Browser JavaScript

```html
<script type="module">
  import { encodeJPEG } from './dist/browser/index.js';
  
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  const result = await encodeJPEG(imageData, { quality: 85 });
  
  // Download the result
  const blob = new Blob([result.buffer], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'encoded.jpg';
  a.click();
</script>
```

---

## API Reference

### `encodeJPEG(imageData, options)`

Encode ImageData to JPEG format.

**Parameters:**
- `imageData`: `ImageData` - Object with `data` (Uint8Array), `width`, and `height`
- `options`: `EncodeOptions` (optional)
  - `quality`: `number` - Quality level 1-100 (default: 75)
  - `fastMode`: `boolean` - Enable fast DCT (default: false)
  - `colorSpace`: `'rgb' | 'grayscale'` - Color space (default: 'rgb')

**Returns:** `Promise<JPEGData>`
- `buffer`: `Uint8Array` - Encoded JPEG data
- `width`: `number` - Image width
- `height`: `number` - Image height

### `encodeJPEGFromFile(filePath, options)`

Encode an image file to JPEG (Node.js only).

**Parameters:**
- `filePath`: `string` - Path to input image
- `options`: `EncodeOptions` (optional) - Same as `encodeJPEG`

**Returns:** `Promise<JPEGData>`

### `decodeJPEG(buffer, options)`

Decode JPEG buffer to ImageData.

**Parameters:**
- `buffer`: `Uint8Array` - JPEG file data
- `options`: `DecodeOptions` (optional)

**Returns:** `Promise<ImageData>`

### `decodeJPEGFromFile(filePath, options)`

Decode a JPEG file (Node.js only).

**Parameters:**
- `filePath`: `string` - Path to JPEG file
- `options`: `DecodeOptions` (optional)

**Returns:** `Promise<ImageData>`

---

## Examples

### Basic Encoding

```typescript
import { encodeJPEGFromFile } from './src/api.js';

const result = await encodeJPEGFromFile('photo.png', { 
  quality: 85 
});

await Bun.write('photo.jpg', result.buffer);
console.log(`Encoded: ${result.width}x${result.height}`);
```

### Batch Processing

```typescript
import { encodeJPEGFromFile } from './src/api.js';
import { readdir } from 'fs/promises';

const files = await readdir('./images');

for (const file of files) {
  if (!file.match(/\.(png|jpg|jpeg)$/i)) continue;
  
  const result = await encodeJPEGFromFile(`./images/${file}`, {
    quality: 75,
    fastMode: true
  });
  
  await Bun.write(`./output/${file}.jpg`, result.buffer);
  console.log(`Processed ${file}`);
}
```

### Quality Comparison

```typescript
import { encodeJPEGFromFile } from './src/api.js';

const qualities = [10, 50, 75, 90, 100];

for (const quality of qualities) {
  const result = await encodeJPEGFromFile('input.png', { quality });
  const sizeKB = (result.buffer.length / 1024).toFixed(1);
  
  console.log(`Quality ${quality}: ${sizeKB} KB`);
  await Bun.write(`output-q${quality}.jpg`, result.buffer);
}
```

### Browser Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>JPEG Encoder Demo</title>
</head>
<body>
  <input type="file" id="upload" accept="image/*">
  <canvas id="canvas"></canvas>
  
  <script type="module">
    import { encodeJPEG } from './dist/browser/index.js';
    
    document.getElementById('upload').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      await new Promise(resolve => img.onload = resolve);
      
      const canvas = document.getElementById('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const result = await encodeJPEG(imageData, { quality: 85 });
      
      console.log('Encoded:', result.buffer.length, 'bytes');
    });
  </script>
</body>
</html>
```

---

## Technical Details

### Encoding Pipeline

1. **Color Space Conversion**: RGB to YCbCr
2. **Block Splitting**: Image divided into 8x8 blocks
3. **DCT**: Discrete Cosine Transform applied
4. **Quantization**: Quality-based coefficient reduction
5. **Zigzag Encoding**: Reorder coefficients
6. **Run-Length Encoding**: Compress zero runs
7. **Huffman Coding**: Entropy encoding
8. **File Assembly**: JPEG markers and headers

### Decoding Pipeline

1. **Marker Parsing**: Read JPEG structure
2. **Huffman Decoding**: Extract coefficients
3. **Inverse Zigzag**: Restore block order
4. **Inverse Quantization**: Scale coefficients
5. **Inverse DCT**: Transform to spatial domain
6. **Color Conversion**: YCbCr to RGB
7. **Image Reconstruction**: Assemble final image

### Performance Features

- **Cached Trigonometry**: Pre-computed DCT coefficients
- **TypedArrays**: Efficient memory operations
- **Fast Mode**: Simplified DCT for 2x speed boost
- **Optimized Loops**: Minimal allocations

---

## Build Commands

```bash
# Build for Node.js
bun run build

# Build for browser
bun run build:browser

# Run CLI in development
bun run dev

# Run tests
bun test

# Clean build artifacts
bun run clean

# Quick encode (dev mode)
bun run encode input.png -q 90

# Quick decode (dev mode)
bun run decode input.jpg
```

---

## Project Structure

```
jpeg.encoder/
├── src/
│   ├── api.ts                    # Public API exports
│   ├── cli.ts                    # Command-line interface
│   ├── encoder.ts                # Main encoder logic
│   ├── decoder.ts                # Main decoder logic
│   ├── index.ts                  # Entry point
│   ├── types.ts                  # TypeScript definitions
│   │
│   ├── core/                     # Core algorithms
│   │   ├── block-processor.ts   # 8x8 block operations
│   │   ├── color-space.ts       # RGB/YCbCr conversion
│   │   ├── dct.ts               # DCT & IDCT transforms
│   │   ├── quantization.ts      # Quantization tables
│   │   └── zigzag.ts            # Zigzag & RLE encoding
│   │
│   ├── encoding/                 # JPEG file format
│   │   ├── bitstream.ts         # Bit-level operations
│   │   ├── entropy-coding.ts    # Entropy encoding
│   │   ├── huffman.ts           # Huffman coding
│   │   ├── jpeg-file.ts         # JPEG markers
│   │   └── jpeg-writer.ts       # File writer
│   │
│   └── image-processing/         # Image I/O
│       ├── image-loader.ts      # Load images (Node.js)
│       └── ycbcr-converter.ts   # YCbCr utilities
│
├── test/                         # Test suite
├── examples/                     # Example scripts
├── demo.html                     # Browser demo
├── dist/                         # Build output
└── package.json
```

---

## Testing

The project includes comprehensive tests:

```bash
bun test
```

**Test Coverage:**
- DCT and IDCT transforms
- Quantization tables
- Zigzag encoding
- Color space conversion
- Block processing
- Huffman coding
- End-to-end encoding
- File I/O operations

**Results:**
- 16 tests passing
- 96 expect() calls
- 100% pass rate

---

## Requirements

- **Runtime**: Bun (latest) or Node.js 18+
- **Dependencies**: Sharp (for Node.js image loading)
- **Browser**: Modern browsers with ES modules support

---

## Contributing

Contributions are welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Author

Pawvan

---

## Repository

https://github.com/renderhq/jpeg.encoder

---

<div align="center">

**[Back to Top](#jpeg-encoder)**

Built with TypeScript and Bun

</div>

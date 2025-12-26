# JPEG Encoder ⚡

A high-performance, pure TypeScript JPEG encoder and decoder. Built as a collection of professional-grade packages for Node.js, the web, and custom implementations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Quick Start

### 1. Install Dependencies
**You must run this commands to link all packages and download dependencies.** This will resolve all lint errors in your editor.

```bash
pnpm install
```

### 2. Run the Web App (Visual Demo)
A beautiful React application running the encoder in the browser.

```bash
pnpm dev
# Opens http://localhost:5173
```

### 3. Run the CLI
Encode images from your terminal.

```bash
pnpm build
node packages/cli/dist/cli.js encode input.png -q 85
```

---

## 📦 Project Structure

This project is organized as a monorepo using **pnpm workspaces**:

- **`packages/core`**: The pure, universal JPEG encoder/decoder library. Zero dependencies. Runs in Browser, Node, Deno, anywhere.
- **`packages/cli`**: A powerful Node.js command-line interface. Uses `sharp` for robust file handling.
- **`apps/web`**: A modern React application demonstrating the encoder in the browser.

---

## 🔧 Installation

We recommend using **pnpm** (preferred) or **Bun**.

```bash
# Clone the repository
git clone https://github.com/renderhq/jpeg.encoder.git
cd jpeg.encoder

# Install dependencies for all packages
pnpm install

# Build everything
pnpm build
```

---

## 📖 Usage Guide

### 1. Using the Core Library (Developers)

Install the core package in your project:

```bash
pnpm add @jpeg-encoder/core
```

```typescript
import { encodeJPEG } from '@jpeg-encoder/core';

// 1. Get image data (e.g. from Canvas or file)
const imageData = {
  data: myUint8ClampedArray, // RGBA pixels
  width: 800,
  height: 600
};

// 2. Encode
const jpeg = await encodeJPEG(imageData, {
  quality: 80,
  onProgress: (pct, stage) => console.log(`${pct}% - ${stage}`)
});

// 3. Use result
console.log('Encoded size:', jpeg.buffer.length);
```

### 2. Using the CLI (End Users)

The CLI tool supports encoding, decoding, and batch processing.

```bash
# General usage
node packages/cli/dist/cli.js <command> [options]

# Encode an image
node packages/cli/dist/cli.js encode photo.png --quality 90 --output optimized.jpg

# Decode a JPEG to raw data
node packages/cli/dist/cli.js decode photo.jpg
```

**Options:**
- `-q, --quality <n>`: Set quality (0-100), default 75.
- `-f, --fast`: Enable fast mode (lower quality, faster).
- `-o, --output <path>`: Specify output filename.

### 3. Running the Web Demo

The web demo is a full React application located in `apps/web`.

```bash
# From root
pnpm dev

# Or directly in apps/web
cd apps/web
pnpm dev
```

---

## ✨ Features

- **Pure TypeScript**: Fully typed, modern codebase.
- **Universal**: Core library has 0 dependencies and runs everywhere.
- **Modular**: separate logic (DCT, Quantization, Huffman) for easy study or extension.
- **Progressive**: Support for progress callbacks and quality presets.
- **Fast**: Optimized for V8/JS engines.

---

## 🛠 Development

### Running Tests
We use Bun for high-performance testing.

```bash
pnpm test
```

### Linting & Formatting
Keep the code clean.

```bash
pnpm run lint  # if configured
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

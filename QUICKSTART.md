# Quick Start Guide

Get up and running with JPEG Encoder in 2 minutes.

## Option 1: Browser Demo (Easiest - No Setup Required)

1. Download or clone this repo
2. Open `demo.html` in your browser
3. Done - drag and drop images to encode

No installation, no build, no configuration required.

---

## Option 2: Command Line (For Developers)

### Step 1: Install Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Step 2: Setup Project

```bash
# Clone the repo
git clone https://github.com/renderhq/jpeg.encoder.git
cd jpeg.encoder

# Install dependencies
bun install

# Build the project
bun run build
```

### Step 3: Use It

```bash
# Encode an image (easy mode)
bun run encode input.png

# This creates: input.jpg (quality 75)

# Custom quality
bun run encode input.png -q 90 -o output.jpg

# Fast mode (2x faster)
bun run encode input.png -f
```

---

## Option 3: Use in Your Code

### Node.js/Bun

```typescript
import { encodeJPEGFromFile } from './src/api.js';

// One line to encode
const result = await encodeJPEGFromFile('photo.png', { quality: 85 });
await Bun.write('photo.jpg', result.buffer);
```

### Browser

```html
<script type="module">
  import { encodeJPEG } from './dist/browser/index.js';
  
  // Get image from canvas
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Encode it
  const result = await encodeJPEG(imageData, { quality: 85 });
  
  // Download
  const blob = new Blob([result.buffer], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'encoded.jpg';
  a.click();
</script>
```

---

## Troubleshooting

### "Command not found: bun"

Install Bun first: https://bun.sh/

### "Cannot find module"

Run `bun run build` first.

### "Sharp error"

Sharp requires Node.js. Install Node.js 18+ from https://nodejs.org/

### Demo not working

Just open `demo.html` directly in Chrome, Firefox, or Safari. No server needed.

---

## Next Steps

- Read the full [README.md](README.md) for API details
- Check [examples/](examples/) for more use cases
- Run `bun test` to verify everything works

---

Need help? Open an issue on GitHub: https://github.com/renderhq/jpeg.encoder

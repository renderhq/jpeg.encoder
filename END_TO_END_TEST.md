# End-to-End Test

This guide walks you through testing the JPEG encoder from start to finish.

## Prerequisites

```bash
# Install Bun if you haven't
curl -fsSL https://bun.sh/install | bash  # macOS/Linux
# or
powershell -c "irm bun.sh/install.ps1 | iex"  # Windows
```

## Step 1: Setup

```bash
# Clone and setup
git clone https://github.com/renderhq/jpeg.encoder.git
cd jpeg.encoder
bun install
bun run build
```

## Step 2: Run Tests

```bash
# Verify everything works
bun test
```

Expected output:
```
16 tests passing
96 expect() calls
100% pass rate
```

## Step 3: Try the Browser Demo

```bash
# Open the demo
open demo.html  # macOS
start demo.html  # Windows
xdg-open demo.html  # Linux
```

1. Drag and drop any image
2. Adjust quality slider
3. Click "Encode to JPEG"
4. Download the result

## Step 4: Try the CLI

```bash
# Create a test image (or use your own)
# Then encode it
bun run encode test-image.png -q 90

# This creates: test-image.jpg
```

## Step 5: Try the API

Create a test file:

```typescript
// test-encode.ts
import { encodeJPEGFromFile } from './src/api.js';

const result = await encodeJPEGFromFile('test-image.png', { 
  quality: 85 
});

await Bun.write('output.jpg', result.buffer);

console.log('Encoded successfully');
console.log(`Size: ${(result.buffer.length / 1024).toFixed(1)} KB`);
console.log(`Dimensions: ${result.width}×${result.height}`);
```

Run it:
```bash
bun run test-encode.ts
```

## Step 6: Try the Simple Example

```bash
bun run examples/simple.ts test-image.png 90
```

## Step 7: Try Batch Processing

```bash
# Create a folder with images
mkdir test-images
# Add some images to test-images/

# Run batch encoder
bun run examples/batch-encode.ts
```

## Verification Checklist

- [ ] Tests pass (`bun test`)
- [ ] Build completes (`bun run build`)
- [ ] Browser demo works (open `demo.html`)
- [ ] CLI encodes images (`bun run encode`)
- [ ] API works in code
- [ ] Examples run successfully

## Troubleshooting

### Build fails
```bash
# Clean and rebuild
bun run clean
bun install
bun run build
```

### Tests fail
```bash
# Check Bun version
bun --version
# Should be latest version

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install
```

### Demo doesn't work
- Make sure you're using a modern browser (Chrome, Firefox, Safari)
- Check browser console for errors (F12)
- Try a different image format

### CLI errors
```bash
# Make sure you built first
bun run build

# Check if input file exists
ls -la your-image.png
```

## Success

If all steps work, you have a fully functional JPEG encoder.

## Next Steps

- Read the [API Reference](README.md#api-reference)
- Explore more [examples/](examples/)
- Customize quality settings for your use case
- Integrate into your project

## Need Help?

- Check [README.md](README.md) for detailed documentation
- See [QUICKSTART.md](QUICKSTART.md) for quick reference
- Open an issue: https://github.com/renderhq/jpeg.encoder/issues

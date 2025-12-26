# Quick Start Guide

Get up and running with the new Monorepo structure in minutes.

## ⚡ Option 1: The Visual Way (Web App)

Want to see it in action visually? Launch the React app.

1. **Install**: `pnpm install`
2. **Run**: `pnpm dev`
3. **Open**: Browser opens automatically at `http://localhost:5173`

Drag & drop images, adjust quality sliders in real-time, and download the optimized JPEGs. The app runs the encoding logic **entirely in your browser** using `packages/core`.

---

## 🖥️ Option 2: The Hacker Way (CLI)

Prefer the terminal? Use our CLI tool.

1. **Build**: `pnpm build`
2. **Run**:
   ```bash
   node packages/cli/dist/cli.js encode input.png -q 90
   ```
3. **Profit**: `input.jpg` is created instantly.

---

## 👨‍💻 Option 3: The Developer Way (Library)

Building your own app? Import the core.

```typescript
import { encodeJPEG } from '@jpeg-encoder/core';

const result = await encodeJPEG(myImageData, {
  preset: 'web', // 'web', 'print', 'archive', etc.
  onProgress: (p) => console.log('Progress:', p)
});
```

See `examples/` folder for more code snippets.

# Contributing to JPEG Encoder

Thank you for your interest in contributing!

## Development Setup

1. Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

2. Clone and install:
```bash
git clone https://github.com/pavanscales/jpeg.encoder.git
cd jpeg.encoder
bun install
```

3. Run tests:
```bash
bun test
```

## Project Structure

- `src/core/` - Core algorithms (DCT, quantization, etc.)
- `src/encoding/` - JPEG encoding logic
- `src/image-processing/` - Image I/O and conversion
- `test/` - Unit tests
- `examples/` - Usage examples

## Code Style

- Use TypeScript with strict mode
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Testing

All new features must include tests:

```typescript
import { describe, test, expect } from 'bun:test';

describe('MyFeature', () => {
  test('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run `bun test`
6. Submit PR with clear description

## Performance Guidelines

- Use TypedArrays for large data
- Cache expensive calculations
- Profile before optimizing
- Document performance trade-offs

## Questions?

Open an issue or reach out to pawanpediredla@gmail.com

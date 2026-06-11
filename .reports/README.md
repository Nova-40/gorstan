# UX Audit Tools

## Spellcheck
Uses `cspell` to check spelling across TypeScript, JavaScript, and Markdown files.

## Image Analysis  
- `images:scan` - Lists all images by size to identify optimization opportunities
- `images:opt` - Placeholder for image optimization workflow

## Accessibility
- `ux:a11y` - Runs axe-core accessibility tests on built application

## Performance  
- `ux:perf` - Lighthouse performance audit with JSON output

## Usage
```bash
npm run spellcheck
npm run images:scan
npm run build && npm run ux:a11y
npm run build && npm run preview & npm run ux:perf
```

Reports are saved to `.reports/` directory.

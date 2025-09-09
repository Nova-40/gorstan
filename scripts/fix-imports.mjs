// Fix .js imports in TypeScript files
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

let fixedCount = 0;

for (const file of files) {
  try {
    const content = readFileSync(file, 'utf8');
    const fixedContent = content.replace(
      /import\s+([^'"]+)\s+from\s+['"]([^'"]+)\.js['"];?/g,
      (match, importPart, path) => {
        return `import ${importPart} from '${path}';`;
      },
    );

    if (content !== fixedContent) {
      writeFileSync(file, fixedContent, 'utf8');
      console.log(`Fixed imports in ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log(`Fixed ${fixedCount} files`);

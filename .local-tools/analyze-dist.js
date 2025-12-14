import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function gzipSizeSync(buffer) {
  return zlib.gzipSync(buffer).length;
}

function readDistFiles(distDir = path.resolve(process.cwd(), 'dist')) {
  if (!fs.existsSync(distDir)) return [];
  const files = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full);
      else {
        const buf = fs.readFileSync(full);
        files.push({ path: path.relative(distDir, full), size: st.size, gz: gzipSizeSync(buf) });
      }
    }
  };
  walk(distDir);
  return files;
}

function topBy(files, key, n = 10) {
  return files.slice().sort((a, b) => b[key] - a[key]).slice(0, n);
}

function human(n) {
  if (n > 1e6) return (n / 1e6).toFixed(2) + ' MB';
  if (n > 1e3) return (n / 1e3).toFixed(2) + ' KB';
  return n + ' B';
}

(async function main(){
  const dist = readDistFiles();
  const js = dist.filter(f => f.path.endsWith('.js'));
  const css = dist.filter(f => f.path.endsWith('.css'));
  // Sum all JS gz as the "initial" JS bundle approximation
  const initialJs = js.reduce((s, f) => s + f.gz, 0);
  const initialCss = css.reduce((s, f) => s + f.gz, 0);

  const topChunks = topBy(js, 'gz', 10).map(f => ({ name: f.path.replace(/\\/g, '/'), raw: f.size, gz: f.gz }));
  const topFiles = topBy(dist, 'gz', 10).map(f => ({ name: f.path.replace(/\\/g, '/'), raw: f.size, gz: f.gz }));
  // Node modules root path used for duplicates and heuristics
  const nm = path.resolve(process.cwd(), 'node_modules');

  // Heuristics for tree-shake issues: detect presence of packages that often cause large imports
  const treeShakeHints = {};
  if (fs.existsSync(nm)) {
    treeShakeHints.moment = fs.existsSync(path.join(nm, 'moment')) || fs.existsSync(path.join(nm, 'moment-timezone'));
    treeShakeHints.lodash = fs.existsSync(path.join(nm, 'lodash'));
    // detect large date libraries
    treeShakeHints['date-fns'] = fs.existsSync(path.join(nm, 'date-fns'));
  }

  // Compute top node_modules packages by size (simple recursive sum)
  const modulesSizes = [];
  if (fs.existsSync(nm)) {
    for (const name of fs.readdirSync(nm)) {
      const full = path.join(nm, name);
      try {
        const st = fs.statSync(full);
        if (!st.isDirectory()) continue;
        // compute size
        let total = 0;
        const walk = (d) => {
          for (const f of fs.readdirSync(d)) {
            const p = path.join(d, f);
            const s = fs.statSync(p);
            if (s.isDirectory()) walk(p);
            else total += s.size;
          }
        };
        walk(full);
        modulesSizes.push({ name, path: full, size: total });
      } catch (e) {}
    }
  }
  const topModules = topBy(modulesSizes, 'size', 10).map(m => ({ name: m.name, raw: m.size }));

  // For each top module, approximate gz by gzipping package.json + readme if present (cheap heuristic)
  for (const m of topModules) {
    try {
      const pj = path.join(nm, m.name, 'package.json');
      const buf = fs.existsSync(pj) ? fs.readFileSync(pj) : Buffer.from('');
      m.gz = gzipSizeSync(buf);
    } catch (e) { m.gz = 0; }
  }

  console.log('SUMMARY');
  console.log('Total JS (gz):', human(initialJs));
  console.log('Total CSS (gz):', human(initialCss));
  console.log('Top chunks:');
  topChunks.forEach((c, i) => console.log(`${i+1}. ${c.name} - raw:${human(c.raw)} gz:${human(c.gz)}`));
  console.log('\nTop files overall:');
  topFiles.forEach((c, i) => console.log(`${i+1}. ${c.name} - raw:${human(c.raw)} gz:${human(c.gz)}`));

  // Duplicate deps heuristic: scan node_modules for package.json versions for common deps
  const duplicates = {};
  if (fs.existsSync(nm)) {
    const pkgs = ['react', 'react-dom', 'lodash', 'date-fns', 'framer-motion', 'lucide-react'];
    for (const pkg of pkgs) {
      const matches = [];
      function walk(dir) {
        for (const name of fs.readdirSync(dir)) {
          const full = path.join(dir, name);
          try {
            const st = fs.statSync(full);
            if (st.isDirectory()) {
              const pj = path.join(full, 'package.json');
              if (fs.existsSync(pj)) {
                try {
                  const ver = JSON.parse(fs.readFileSync(pj, 'utf8')).version;
                  if (path.basename(full) === pkg) matches.push({ path: full, version: ver });
                } catch (e) {}
              }
              walk(full);
            }
          } catch (e) {}
        }
      }
      try { walk(nm); } catch (e) {}
      if (matches.length > 1) duplicates[pkg] = matches;
    }
  }

  console.log('\nDuplicate deps:');
  console.log(JSON.stringify(duplicates, null, 2));

  // Tree-shake heuristics: look for large vendor chunks
  console.log('\nTree-shake hints:');
  console.log(JSON.stringify(treeShakeHints, null, 2));
  topChunks.slice(0,5).forEach(c => console.log(`- ${c.name} (${human(c.gz)})`));

  // Write JSON report
  const report = { totalJsGz: initialJs, totalCssGz: initialCss, topChunks, topFiles, duplicates, treeShakeHints };
  fs.writeFileSync(path.resolve(process.cwd(), '.local-pr', 'bundle-report.json'), JSON.stringify(report, null, 2));
  console.log('\nWrote .local-pr/bundle-report.json');
})();

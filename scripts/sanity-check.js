#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');
const dist = join(root, 'dist');

const errors = [];

// 1. Build artifact exists
if (!existsSync(dist)) {
  errors.push('dist/ does not exist — run `npm run build` first');
}

// 2. PWA manifest
const manifestPath = join(dist, 'manifest.webmanifest');
if (!existsSync(manifestPath)) {
  errors.push('manifest.webmanifest not found in dist/');
} else {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    if (!manifest.name) errors.push('manifest missing "name"');
    if (!manifest.icons?.length) errors.push('manifest has no icons');
    if (manifest.display !== 'standalone') {
      errors.push(`display is "${manifest.display}", expected "standalone"`);
    }
    // Verify each referenced icon file exists
    for (const icon of manifest.icons || []) {
      const iconSrc = typeof icon.src === 'string' ? icon.src : null;
      if (iconSrc && !existsSync(join(dist, iconSrc))) {
        errors.push(`Referenced icon "${iconSrc}" not found in dist/`);
      }
    }
  } catch {
    errors.push('manifest.webmanifest is not valid JSON');
  }
}

// 3. Service worker
const swPath = join(dist, 'sw.js');
if (!existsSync(swPath)) {
  errors.push('sw.js not found in dist/');
}

// 4. Main JS bundle not suspiciously small
const assetsDir = join(dist, 'assets');
if (existsSync(assetsDir) && existsSync(manifestPath)) {
  const htmlPath = join(dist, 'index.html');
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf-8');
    const jsRefs = [...html.matchAll(/src="(assets\/[^"]+\.js)"/g)].map(m => m[1]);
    for (const js of new Set(jsRefs)) {
      const jsPath = join(dist, js);
      if (existsSync(jsPath)) {
        const size = readFileSync(jsPath).byteLength;
        if (size < 100) {
          errors.push(`${js} is suspiciously small (${size} bytes)`);
        }
      } else {
        errors.push(`${js} referenced in index.html but not found in dist/`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('Sanity check failed:\n');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error();
  process.exit(1);
}

console.log('Sanity check passed ✓');
console.log('  manifest.webmanifest — present');
console.log('  sw.js — present');
console.log('  display: standalone');
process.exit(0);

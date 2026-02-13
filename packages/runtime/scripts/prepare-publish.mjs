import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimeDir = path.resolve(__dirname, '..');
const distPublish = path.join(runtimeDir, 'dist-publish');

// 1. Remove and recreate dist-publish/
fs.rmSync(distPublish, {recursive: true, force: true});
fs.mkdirSync(distPublish, {recursive: true});

// 2. Copy dist/ into dist-publish/dist/
fs.cpSync(path.join(runtimeDir, 'dist'), path.join(distPublish, 'dist'), {recursive: true});

// 3. Copy LICENSE and README.md from the repo root (if they exist)
const repoRoot = path.resolve(runtimeDir, '../..');
for (const file of ['LICENSE', 'README.md']) {
  const src = path.join(repoRoot, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distPublish, file));
  }
}

// 4. Generate a modified package.json
const pkg = JSON.parse(fs.readFileSync(path.join(runtimeDir, 'package.json'), 'utf-8'));
pkg.name = 'ohm-js';
delete pkg.scripts;
delete pkg.publishConfig;
delete pkg.devDependencies;
fs.writeFileSync(path.join(distPublish, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

console.log('dist-publish/ is ready.');

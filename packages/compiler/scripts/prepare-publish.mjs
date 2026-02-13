import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compilerRoot = path.resolve(__dirname, '..');
const distPublish = path.join(compilerRoot, 'dist-publish');

// 1. Remove and recreate dist-publish/
fs.rmSync(distPublish, {recursive: true, force: true});
fs.mkdirSync(distPublish, {recursive: true});

// 2. Copy dist/ into dist-publish/dist/
fs.cpSync(path.join(compilerRoot, 'dist'), path.join(distPublish, 'dist'), {
  recursive: true,
});

// 3. Copy README.md if it exists
const readme = path.join(compilerRoot, 'README.md');
if (fs.existsSync(readme)) {
  fs.copyFileSync(readme, path.join(distPublish, 'README.md'));
}

// 4. Copy LICENSE if it exists
const license = path.join(compilerRoot, '../../LICENSE');
if (fs.existsSync(license)) {
  fs.copyFileSync(license, path.join(distPublish, 'LICENSE'));
}

// 5. Build a modified package.json
const pkg = JSON.parse(
  fs.readFileSync(path.join(compilerRoot, 'package.json'), 'utf-8')
);
const runtimePkg = JSON.parse(
  fs.readFileSync(
    path.join(compilerRoot, '../runtime/package.json'),
    'utf-8'
  )
);

delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.publishConfig;

const deps = {...pkg.dependencies};
delete deps['@ohm-js/runtime'];
delete deps['ohm-js'];
deps['ohm-js'] = `^${runtimePkg.version}`;
pkg.dependencies = deps;

fs.writeFileSync(
  path.join(distPublish, 'package.json'),
  JSON.stringify(pkg, null, 2) + '\n'
);

console.log('dist-publish/ prepared successfully.');

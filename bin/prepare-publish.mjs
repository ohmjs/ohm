/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const pkgDir = path.resolve(process.argv[2]); // eslint-disable-line no-undef
const repoRoot = path.resolve(pkgDir, '../..');
const distPublish = path.join(pkgDir, 'dist-publish');

// Clean and recreate dist-publish/
fs.rmSync(distPublish, {recursive: true, force: true});
fs.mkdirSync(distPublish, {recursive: true});

// Copy dist/
fs.cpSync(path.join(pkgDir, 'dist'), path.join(distPublish, 'dist'), {recursive: true});

// Copy LICENSE and README.md (check both package dir and repo root)
for (const file of ['LICENSE', 'README.md']) {
  for (const dir of [pkgDir, repoRoot]) {
    const src = path.join(dir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(distPublish, file));
      break;
    }
  }
}

// Read and clean up package.json
const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
delete pkg.scripts;
delete pkg.publishConfig;
delete pkg.devDependencies;

// Package-specific transforms
const pkgName = pkg.name;
if (pkgName === '@ohm-js/runtime') {
  pkg.name = 'ohm-js';
} else if (pkgName === '@ohm-js/compiler') {
  const runtimePkg = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'packages/runtime/package.json'), 'utf-8')
  );
  const deps = {...pkg.dependencies};
  delete deps['@ohm-js/runtime'];
  delete deps['ohm-js'];
  deps['ohm-js'] = `^${runtimePkg.version}`;
  pkg.dependencies = deps;
}

fs.writeFileSync(path.join(distPublish, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
console.log(`${pkgName}: dist-publish/ is ready.`);

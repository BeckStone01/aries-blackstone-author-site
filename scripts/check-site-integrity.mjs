import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'site-source-manifest.json');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`PASS: ${message}`);
}

if (!fs.existsSync(manifestPath)) {
  console.error('ERROR: site-source-manifest.json is missing.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const routes = Array.isArray(manifest.routes) ? manifest.routes : [];
const requiredSupportFiles = Array.isArray(manifest.requiredSupportFiles) ? manifest.requiredSupportFiles : [];

if (!manifest.canonicalDomain || manifest.canonicalDomain !== 'https://aries-blackstone.com') {
  fail('Canonical domain must be https://aries-blackstone.com.');
} else {
  ok('Canonical domain is locked.');
}

if (!routes.length) fail('No routes are defined in the source manifest.');

for (const entry of routes) {
  if (!entry?.required) continue;
  const source = String(entry.source || '').trim();
  if (!source) {
    fail(`Route ${entry.route || '(unknown)'} has no source file.`);
    continue;
  }
  const filePath = path.join(root, source);
  if (!fs.existsSync(filePath)) {
    fail(`Required live route ${entry.route} is missing source file: ${source}`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${source} is missing a page title.`);
  if (!/<meta\s+name=["']description["'][^>]*content=["'][^"']+/i.test(html) && !/<meta\s+content=["'][^"']+["'][^>]*name=["']description["']/i.test(html)) {
    fail(`${source} is missing a meta description.`);
  }
  ok(`${entry.route} -> ${source}`);
}

for (const file of requiredSupportFiles) {
  if (!fs.existsSync(path.join(root, file))) fail(`Required support file is missing: ${file}`);
  else ok(`Support file present: ${file}`);
}

const redirectsPath = path.join(root, '_redirects');
if (fs.existsSync(redirectsPath)) {
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  for (const entry of routes) {
    if (!entry?.required || entry.route === '/') continue;
    const sourceRoute = String(entry.route || '').trim();
    if (!sourceRoute) continue;
    if (!redirects.split(/\r?\n/).some((line) => line.trim().startsWith(`${sourceRoute} `))) {
      console.warn(`WARN: ${sourceRoute} is not explicitly represented in _redirects.`);
    }
  }
}

if (process.exitCode) {
  console.error('\nAries Blackstone site integrity check FAILED. Restore missing live source before treating this repository as deployment-complete.');
} else {
  console.log('\nAries Blackstone site integrity check PASSED. Repository contains the required public source surface.');
}

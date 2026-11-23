import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const books = [
  ['quantum-edge', 'B0CLR9WBXK'],
  ['quantum-pursuit', 'B0DW2PYK4K'],
  ['quantum-divide', 'B0GX2SSSBC'],
];
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : extname(pathname) ? pathname : pathname + '.html'));
  if (!file.startsWith(root + sep)) return res.writeHead(404).end();
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome' });
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://**/*', route => route.abort());
    for (const [slug, asin] of books) {
      await page.goto(origin + '/' + slug);
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflows, false, slug + ' overflows at ' + width);
      assert.ok(await page.locator('main img').evaluate(img => img.complete && img.naturalWidth > 0));
      assert.ok((await page.locator('main a.buy-now').getAttribute('href')).includes(asin));
      await page.getByRole('link', { name: 'Read an excerpt' }).click();
      assert.equal(new URL(page.url()).hash, '#excerpt');
      assert.ok((await page.locator('#excerpt blockquote').innerText()).length > 100);
    }
    await page.goto(origin + '/');
    await page.getByRole('link', { name: 'Continue with Quantum Pursuit', exact: true }).click();
    assert.equal(new URL(page.url()).pathname, '/quantum-pursuit');
    await page.getByRole('link', { name: 'Next in the series: Quantum Divide' }).click();
    assert.equal(new URL(page.url()).pathname, '/quantum-divide');
    await page.getByRole('link', { name: 'Why I created Dr. Ladonna Stone' }).click();
    const essayPath = new URL(page.url()).pathname;
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://aries-blackstone.com' + essayPath);
    for (const route of ['/reviews', '/appearances', '/coming-soon', '/contact', '/children', '/books']) {
      await page.goto(origin + route);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route + ' overflows at ' + width);
      const levels = await page.locator('main :is(h1,h2,h3,h4)').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])));
      assert.equal(levels[0], 1, route);
      assert.ok(levels.every((level, i) => i === 0 || level <= levels[i - 1] + 1), route + ' skips a heading level');
    }
    await page.goto(origin + '/reviews');
    assert.equal(await page.getByRole('link', { name: 'Read Ams Strong’s full review' }).getAttribute('href'), 'https://forums.onlinebookclub.org/viewtopic.php?f=53&t=392192');
    await page.getByRole('link', { name: 'read the opening excerpt from Quantum Edge' }).click();
    assert.equal(new URL(page.url()).pathname, '/quantum-edge');
    assert.deepEqual(errors, []);
    await page.close();
    console.log('Trilogy reader checks passed at ' + width + 'px.');
  }
} finally {
  try { await browser?.close(); } finally { server.close(); }
}

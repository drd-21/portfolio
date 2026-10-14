/** Dependency-free smoke tests for the static production build. */
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { portfolio } from '../src/data.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { site, projects } = portfolio;
const ids = projects.map((project) => project.id);
assert.equal(new Set(ids).size, ids.length, 'Project IDs must be unique.');
assert.ok(projects.length > 0, 'At least one project is expected.');
for (const relative of [site.photo, site.resumePath, site.cvPath, site.ogImage, ...projects.map((p) => p.image)]) {
  assert.ok(relative.startsWith('./assets/'), `Unexpected asset location: ${relative}`);
  const file = path.join(dist, relative.replace(/^\.\//, ''));
  assert.ok((await stat(file)).size > 0, `Missing or empty asset: ${file}`);
}
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
for (const fragment of ['<title>', 'og:title', 'og:image', 'application/ld+json', 'rel="canonical"', 'src="./src/main.js"']) {
  assert.ok(html.includes(fragment), `Built HTML missing ${fragment}`);
}
assert.ok((await readFile(path.join(dist, 'sitemap.xml'), 'utf8')).includes(site.websiteUrl));
assert.ok((await readFile(path.join(dist, 'robots.txt'), 'utf8')).includes('Sitemap:'));
for (const pdf of [site.resumePath, site.cvPath]) {
  const buffer = await readFile(path.join(dist, pdf.replace(/^\.\//, '')));
  assert.equal(buffer.subarray(0, 4).toString(), '%PDF', 'Invalid sample PDF');
}
const port = 49321;
const server = spawn(process.execPath, ['scripts/serve.mjs', 'dist', String(port)], { cwd: root, stdio: 'ignore' });
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.status === 200) { ready = true; break; }
    } catch (_) { /* not started yet */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Preview server did not start.');
  for (const [url, type] of [['/', 'text/html'], ['/src/main.js', 'text/javascript'], ['/src/styles.css', 'text/css'], ['/assets/resume.pdf', 'application/pdf'], ['/assets/projects/menu.svg', 'image/svg+xml'], ['/sitemap.xml', 'application/xml']]) {
    const response = await fetch(`http://127.0.0.1:${port}${url}`);
    assert.equal(response.status, 200, `Failed ${url}`);
    assert.ok(response.headers.get('content-type')?.includes(type), `Unexpected Content-Type for ${url}`);
  }
  const missing = await fetch(`http://127.0.0.1:${port}/does-not-exist`);
  assert.equal(missing.status, 404, 'Missing files should return HTTP 404.');
  console.log('PASS: metadata, project assets, PDF files, HTTP routes, MIME types, 404 response.');
} finally { server.kill(); }

/** Dependency-free smoke tests for the static production build. */
import assert from 'node:assert/strict';
import { readFile, stat, writeFile, unlink } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { portfolio } from '../src/data.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const { site, projects } = portfolio;
const ids = projects.map((project) => project.id);
assert.equal(new Set(ids).size, ids.length, 'Project IDs must be unique.');
assert.deepEqual(ids, ['attendease', 'blooming-memories', 'sari-sari-pos', 'smart-menu'], 'CMS migration must preserve the existing published projects and order.');
assert.equal(portfolio.contact.formspreeId, 'mvkzwlda', 'The existing Formspree form ID must be preserved.');
assert.ok(portfolio.skills[0].items.every((skill) => typeof skill.name === 'string'), 'CMS skills should be generated as structured skill records.');
assert.deepEqual(portfolio.skills.map(({ category, icon }) => [category, icon]), [
  ['AI-Assisted Development', 'sparkles'],
  ['Systems & Planning', 'layers'],
  ['Development Workflow', 'terminal'],
  ['Technologies & Tools', 'code'],
  ['Design & Collaboration', 'pen'],
], 'Skills should use the requested CMS-editable categories in order.');
assert.deepEqual(portfolio.skills[0].items.map(({ name }) => name), [
  'AI-Assisted Software Development (Vibe Coding)',
  'Prompt Engineering',
  'AI-Assisted Prototyping',
  'Iterative Prompt Refinement',
  'AI-Guided Implementation',
], 'AI-assisted development should be the first skill group.');
for (const relative of [site.photo, site.resumePath, site.cvPath, site.ogImage, ...projects.map((p) => p.image)]) {
  assert.ok(relative.startsWith('./assets/'), `Unexpected asset location: ${relative}`);
  const file = path.join(dist, relative.replace(/^\.\//, ''));
  assert.ok((await stat(file)).size > 0, `Missing or empty asset: ${file}`);
}
for (const project of projects) {
  for (const screenshot of project.screenshots) {
    const file = path.join(dist, screenshot.replace(/^\.\//, ''));
    assert.ok((await stat(file)).size > 0, `Missing project screenshot: ${file}`);
  }
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

const projectPath = path.join(root, 'content', 'projects', 'cms-test-project.json');
const sitePath = path.join(root, 'content', 'site.json');
const skillPath = path.join(root, 'content', 'skills.json');
const originalSite = await readFile(sitePath, 'utf8');
const originalSkills = await readFile(skillPath, 'utf8');
const sample = JSON.parse(await readFile(path.join(root, 'content', 'projects', 'attendease.json'), 'utf8'));
assert.equal(await stat(projectPath).then(() => true, () => false), false, 'Temporary CMS test project must not already exist.');
const runGenerator = () => spawnSync(process.execPath, ['scripts/generate-data.mjs'], { cwd: root, encoding: 'utf8' });
const loadGenerated = () => import(`../src/data.js?cms-test=${Date.now()}-${Math.random()}`);
try {
  const newProject = {
    ...sample,
    id: 'cms-test-project',
    title: 'CMS-generated test project',
    displayOrder: 1000,
    featured: false,
    published: true,
  };
  await writeFile(projectPath, `${JSON.stringify(newProject, null, 2)}\n`, 'utf8');
  let generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept a valid new CMS project: ${generation.stderr}`);
  let generated = await loadGenerated();
  assert.equal(generated.portfolio.projects.at(-1).id, 'cms-test-project', 'New published CMS projects should appear in generated data.');

  newProject.published = false;
  await writeFile(projectPath, `${JSON.stringify(newProject, null, 2)}\n`, 'utf8');
  generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept an unpublished CMS project: ${generation.stderr}`);
  generated = await loadGenerated();
  assert.ok(!generated.portfolio.projects.some((project) => project.id === newProject.id), 'Unpublished projects should not appear in generated data.');

  await unlink(projectPath);
  generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept a deleted CMS project: ${generation.stderr}`);
  generated = await loadGenerated();
  assert.ok(!generated.portfolio.projects.some((project) => project.id === newProject.id), 'Deleted project files should be removed from generated data.');

  const editedSite = JSON.parse(originalSite);
  editedSite.name = 'CMS profile edit test';
  await writeFile(sitePath, `${JSON.stringify(editedSite, null, 2)}\n`, 'utf8');
  generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept CMS profile edits: ${generation.stderr}`);
  generated = await loadGenerated();
  assert.equal(generated.portfolio.site.name, editedSite.name, 'Profile edits should reach the frontend export.');

  editedSite.name = JSON.parse(originalSite).name;
  editedSite.photo = 'assets/uploads/images/test-profile.webp';
  await writeFile(sitePath, `${JSON.stringify(editedSite, null, 2)}\n`, 'utf8');
  const uploadedImagePath = path.join(root, 'assets', 'uploads', 'images', 'test-profile.webp');
  await writeFile(uploadedImagePath, 'test upload');
  generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept Pages CMS relative media paths: ${generation.stderr}`);
  generated = await loadGenerated();
  assert.equal(generated.portfolio.site.photo, `./${editedSite.photo}`, 'Uploaded images should normalize to a GitHub Pages-safe relative path.');
  await unlink(uploadedImagePath);
  await writeFile(sitePath, originalSite, 'utf8');

  const editedSkills = JSON.parse(originalSkills);
  editedSkills[0].items[0].name = 'CMS skill edit test';
  await writeFile(skillPath, `${JSON.stringify(editedSkills, null, 2)}\n`, 'utf8');
  generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should accept CMS skill edits: ${generation.stderr}`);
  generated = await loadGenerated();
  assert.equal(generated.portfolio.skills[0].items[0].name, 'CMS skill edit test', 'Skill edits should reach the frontend export.');

  newProject.github = 'javascript:alert(1)';
  newProject.published = true;
  await writeFile(projectPath, `${JSON.stringify(newProject, null, 2)}\n`, 'utf8');
  generation = runGenerator();
  assert.notEqual(generation.status, 0, 'Generator must reject unsafe external project URLs.');
} finally {
  await writeFile(sitePath, originalSite, 'utf8');
  await writeFile(skillPath, originalSkills, 'utf8');
  await unlink(path.join(root, 'assets', 'uploads', 'images', 'test-profile.webp')).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  await unlink(projectPath).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  const generation = runGenerator();
  assert.equal(generation.status, 0, `Generator should restore clean content after CMS behavior tests: ${generation.stderr}`);
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
  console.log('PASS: CMS content validation/generation, publication filtering, metadata, project assets, PDFs, HTTP routes, MIME types, 404 response.');
} finally { server.kill(); }

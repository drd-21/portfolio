/** Assemble Pages CMS JSON into the portfolio export used by the frontend. */
import { open, readFile, realpath, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = path.join(root, 'content');
const assets = await realpath(path.join(root, 'assets'));
const generatedFile = path.join(root, 'src', 'data.js');

async function readJson(relativePath) {
  const file = path.join(content, relativePath);
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid or unreadable content/${relativePath}: ${error.message}`);
  }
}

function requireText(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is required and must be a non-empty string.`);
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
}

function requireStringArray(value, label) {
  requireArray(value, label);
  value.forEach((item, index) => requireText(item, `${label}[${index}]`));
}

function assetPath(value, label, { optional = false } = {}) {
  if (optional && value === '') return;
  requireText(value, label);
  const repositoryPath = value.startsWith('./') ? value.slice(2) : value;
  if (!/^assets\/[A-Za-z0-9._/-]+$/.test(repositoryPath)
    || repositoryPath.split('/').some((part) => part === '..' || part === '.' || part === '')) {
    throw new Error(`${label} must be a relative path inside assets/.`);
  }
  return `./${repositoryPath}`;
}

async function existingAsset(value, label, options = {}) {
  const normalized = assetPath(value, label, options);
  if (options?.optional && value === '') return;
  const file = path.join(root, normalized.slice(2));
  try {
    const resolved = await realpath(file);
    const relativeToAssets = path.relative(assets, resolved);
    if (relativeToAssets === '..' || relativeToAssets.startsWith(`..${path.sep}`) || path.isAbsolute(relativeToAssets)) {
      throw new Error('resolved path is outside the assets directory');
    }
    if (!(await stat(resolved)).isFile()) throw new Error('not a file');
    if (options.extensions && !options.extensions.includes(path.extname(resolved).toLowerCase())) {
      throw new Error(`expected one of: ${options.extensions.join(', ')}`);
    }
    if (options.pdf) {
      const handle = await open(resolved, 'r');
      const signatureBytes = Buffer.alloc(5);
      try {
        await handle.read(signatureBytes, 0, signatureBytes.length, 0);
      } finally {
        await handle.close();
      }
      const signature = signatureBytes.toString();
      if (signature !== '%PDF-') throw new Error('not a valid PDF file');
    }
  } catch (error) {
    throw new Error(`Invalid or missing asset for ${label} (${value}): ${error.message}`);
  }
  return normalized;
}

function externalUrl(value, label, { optional = true } = {}) {
  if (optional && value === '') return;
  requireText(value, label);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid HTTPS URL.`);
  }
  if ((url.protocol !== 'https:' && url.protocol !== 'http:')
    || !url.hostname || url.username || url.password || value.includes('\\')) {
    throw new Error(`${label} must be a public HTTPS or HTTP URL without credentials.`);
  }
}

async function loadCollection(directory) {
  const folder = path.join(content, directory);
  let names;
  try {
    names = await readdir(folder);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = names.filter((name) => name.toLowerCase().endsWith('.json')).sort();
  return Promise.all(files.map((name) => readJson(path.join(directory, name))));
}

const site = await readJson('site.json');
const seo = await readJson('seo.json');
const documents = await readJson('documents.json');
const socials = await readJson('socials.json');
const about = await readJson('about.json');
const education = await readJson('education.json');
const experience = await readJson('experience.json');
const skills = await readJson('skills.json');
const certifications = await loadCollection('certifications');
const cv = await readJson('cv.json');
const contact = await readJson('contact.json');
const projectFiles = await loadCollection('projects');
Object.assign(site, seo, documents, { socials });
requireArray(site.socials, 'Social links');
for (const key of ['tagline', 'availability', 'city', 'country', 'phone']) site[key] ??= '';
for (const [index, social] of site.socials.entries()) {
  social.url ??= '';
  social.icon ??= 'globe';
  requireText(social.label, `Social link ${index + 1} label`);
  externalUrl(social.url, `Social link ${social.label}`);
}

requireText(site.name, 'Profile name');
requireText(site.initials, 'Profile initials');
requireText(site.role, 'Professional title');
requireText(site.intro, 'Hero introduction');
requireText(site.email, 'Email');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email)) throw new Error('Profile email must be a valid email address.');
externalUrl(site.websiteUrl, 'Website URL', { optional: false });
requireText(site.photoAlt, 'Profile photo alternative text');
requireText(site.description, 'SEO description');
site.photo = await existingAsset(site.photo, 'Profile photo', { extensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'] });
site.resumePath = await existingAsset(site.resumePath, 'Resume PDF', { extensions: ['.pdf'], pdf: true });
site.cvPath = await existingAsset(site.cvPath, 'CV PDF', { extensions: ['.pdf'], pdf: true });
site.ogImage = await existingAsset(site.ogImage, 'Social sharing image', { extensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'] });
requireText(about.headline, 'About headline');
about.paragraphs ??= [];
about.interests ??= [];
requireStringArray(about.paragraphs, 'About paragraphs');
requireStringArray(about.interests, 'About interests');
about.facts ??= [];
requireArray(about.facts, 'About facts');
for (const [index, fact] of about.facts.entries()) {
  requireText(fact.label, `About fact ${index + 1} label`);
  requireText(fact.value, `About fact ${index + 1} value`);
}
requireArray(education, 'Education');
for (const [index, item] of education.entries()) {
  requireText(item.school, `Education ${index + 1} school`);
  requireText(item.degree, `Education ${index + 1} degree`);
  requireText(item.period, `Education ${index + 1} period`);
  item.highlights ??= [];
  requireStringArray(item.highlights, `Education ${index + 1} highlights`);
  item.honors ??= [];
  requireStringArray(item.honors, `Education ${index + 1} honors`);
}
requireArray(experience, 'Experience');
for (const [index, item] of experience.entries()) {
  for (const key of ['role', 'organization', 'period', 'type']) {
    requireText(item[key], `Experience ${index + 1} ${key}`);
  }
  item.description ??= '';
  item.bullets ??= [];
  requireStringArray(item.bullets, `Experience ${index + 1} responsibilities`);
  item.achievements ??= [];
  requireStringArray(item.achievements, `Experience ${index + 1} achievements`);
}
requireArray(skills, 'Skills');
for (const [index, group] of skills.entries()) {
  requireText(group.category, `Skill group ${index + 1} category`);
  group.icon ??= 'sparkles';
  group.items ??= [];
  requireArray(group.items, `Skill group ${index + 1} skills`);
  for (const [skillIndex, skill] of group.items.entries()) {
    requireText(skill.name, `Skill group ${index + 1} skill ${skillIndex + 1} name`);
    skill.proficiency ??= '';
  }
}

const projectIds = new Set();
for (const [index, project] of projectFiles.entries()) {
  requireText(project.id, `Project ${index + 1} ID`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.id)) {
    throw new Error(`Project ID "${project.id}" must use lowercase letters, numbers, and hyphens.`);
  }
  if (projectIds.has(project.id)) throw new Error(`Duplicate project ID: ${project.id}`);
  projectIds.add(project.id);
  for (const key of ['title', 'category', 'year', 'summary', 'detail']) {
    requireText(project[key], `Project "${project.id}" ${key}`);
  }
  project.image = await existingAsset(project.image, `Project "${project.id}" thumbnail`, { extensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'] });
  requireText(project.imageAlt, `Project "${project.id}" image alternative text`);
  for (const key of ['subtitle', 'status', 'badge', 'demo', 'github']) project[key] ??= '';
  for (const key of ['subtitle', 'status', 'badge', 'demo', 'github']) {
    if (typeof project[key] !== 'string') throw new Error(`Project "${project.id}" ${key} must be text.`);
  }
  for (const key of ['contribution', 'tags', 'features', 'challenges', 'screenshots']) {
    project[key] ??= [];
    requireArray(project[key], `Project "${project.id}" ${key}`);
  }
  for (const key of ['contribution', 'tags', 'features', 'challenges']) {
    requireStringArray(project[key], `Project "${project.id}" ${key}`);
  }
  for (const [imageIndex, image] of project.screenshots.entries()) {
    project.screenshots[imageIndex] = await existingAsset(image, `Project "${project.id}" screenshot ${imageIndex + 1}`, { extensions: ['.jpg', '.jpeg', '.png', '.webp'] });
  }
  if (!Number.isInteger(project.displayOrder)) {
    throw new Error(`Project "${project.id}" displayOrder must be an integer.`);
  }
  project.featured ??= false;
  project.published ??= true;
  if (typeof project.featured !== 'boolean' || typeof project.published !== 'boolean') {
    throw new Error(`Project "${project.id}" featured and published values must be booleans.`);
  }
  externalUrl(project.demo, `Project "${project.id}" live demo URL`);
  externalUrl(project.github, `Project "${project.id}" repository URL`);
}

for (const [index, certification] of certifications.entries()) {
  for (const key of ['title', 'issuer', 'date']) {
    requireText(certification[key], `Certification ${index + 1} ${key}`);
  }
  certification.description ??= '';
  certification.credentialId ??= '';
  certification.image ??= '';
  certification.url ??= '';
  certification.displayOrder ??= index + 1;
  if (!Number.isInteger(certification.displayOrder)) {
    throw new Error(`Certification "${certification.title}" displayOrder must be an integer.`);
  }
  externalUrl(certification.url, `Certification "${certification.title}" verification URL`);
  if (certification.image) {
    certification.image = await existingAsset(certification.image, `Certification "${certification.title}" image`, { extensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'] });
  }
}

requireText(cv.objective, 'CV profile');
cv.additional ??= [];
requireStringArray(cv.additional, 'CV additional details');
requireText(contact.headline, 'Contact headline');
contact.description ??= '';
contact.successMessage ??= 'Thanks for reaching out!';
requireText(contact.formspreeId, 'Formspree form ID');
if (!/^[A-Za-z0-9]{8,}$/.test(contact.formspreeId)) throw new Error('Contact Formspree form ID has an invalid format.');

const projects = projectFiles
  .filter((project) => project.published)
  .sort((left, right) => left.displayOrder - right.displayOrder || left.id.localeCompare(right.id));
const portfolio = {
  site,
  about,
  education,
  experience,
  skills,
  projects,
  certifications: certifications.sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title)),
  cv,
  contact,
};

await writeFile(
  generatedFile,
  `// Generated from content/*.json by scripts/generate-data.mjs. Do not edit directly.\nexport const portfolio = ${JSON.stringify(portfolio, null, 2)};\n`,
  'utf8',
);
console.log(`Validated CMS content and generated src/data.js (${projects.length} published projects).`);

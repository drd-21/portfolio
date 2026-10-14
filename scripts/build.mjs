/**
 * Zero-dependency static site build.
 * Run: npm run build
 * Reads the single content file and writes index meta tags, canonical URL,
 * share preview, JSON-LD, robots.txt and sitemap.xml into ./dist.
 */
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { portfolio } from '../src/data.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const { site } = portfolio;
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const escapeXml = escapeHtml;
const title = `${site.name} — ${site.role}`;
const baseUrl = new URL(site.websiteUrl.endsWith('/') ? site.websiteUrl : `${site.websiteUrl}/`);
if (!/^https?:$/.test(baseUrl.protocol)) throw new Error('site.websiteUrl must be an http(s) URL.');
const ogImage = new URL(site.ogImage.replace(/^\.\//, ''), baseUrl).href;
const setMeta = (html, type, key, content) => html.replace(
  new RegExp(`(<meta\\s+${type}="${key}"\\s+content=")[^"]*("\\s*\\/?>)`, 'i'),
  (_, start, end) => `${start}${escapeHtml(content)}${end}`,
);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'src'), path.join(out, 'src'), { recursive: true });
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
let html = await readFile(path.join(root, 'index.html'), 'utf8');
html = setMeta(html, 'name', 'description', site.description);
html = setMeta(html, 'property', 'og:title', title);
html = setMeta(html, 'property', 'og:description', site.intro);
html = setMeta(html, 'property', 'og:image', ogImage);
html = setMeta(html, 'property', 'og:url', baseUrl.href);
html = setMeta(html, 'name', 'twitter:title', title);
html = setMeta(html, 'name', 'twitter:description', site.intro);
html = setMeta(html, 'name', 'twitter:image', ogImage);
html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
html = html.replace(/(<link rel="canonical" href=")[^"]*(" \/>)/, (_, a, b) => `${a}${escapeHtml(baseUrl.href)}${b}`);
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: baseUrl.href,
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.country },
  sameAs: site.socials.map((social) => social.url).filter((url) => /^https:\/\//i.test(url)),
};
html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n  </head>`);
await writeFile(path.join(out, 'index.html'), html);
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${baseUrl.href}sitemap.xml\n`);
await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeXml(baseUrl.href)}</loc></url>\n</urlset>\n`);
console.log(`Built ${out} — meta tags, SEO files and public assets included.`);

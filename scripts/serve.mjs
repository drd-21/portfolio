/** Dependency-free local server. Usage: npm run dev OR npm run preview */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.resolve(root, process.argv[2] || '.');
const port = Number(process.argv[3] || process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};
http.createServer(async (req, res) => {
  try {
    const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const candidate = path.resolve(directory, `.${requestPath === '/' ? '/index.html' : requestPath}`);
    if (candidate !== directory && !candidate.startsWith(directory + path.sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    if (!(await stat(candidate)).isFile()) throw new Error('Not a file');
    const content = await readFile(candidate);
    res.writeHead(200, { 'Content-Type': types[path.extname(candidate)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (_) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Portfolio running at http://127.0.0.1:${port}`));

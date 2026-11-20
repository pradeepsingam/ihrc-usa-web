import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';

// Use Vite's module loader so JSX and the build's CMS configuration stay aligned.
const server = await createServer({ mode: 'production', server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: 'custom' });
try {
  const { prepare } = await server.ssrLoadModule('/src/entry-prerender.jsx');
  const { getRoutes, getMetadata, headMarkup, aliases, SITE_URL, render } = await prepare();
  const template = readFileSync('dist/index.html', 'utf8');
  const routes = getRoutes();
  const sitemap = [];
  const manifest = [];
  for (const path of [...routes, '/404']) {
    if (!/^\/(?:[a-zA-Z0-9_-]+\/?)*$/.test(path)) throw new Error(`Unsafe route: ${path}`);
    const meta = getMetadata(path);
    const html = template.replace('<!--seo-head-->', () => headMarkup(meta))
      .replace('<div id="root"></div>', () => `<div id="root">${render(path)}</div>`);
    const destination = path === '/404' ? 'dist/404.html' : `dist${path === '/' ? '' : path}/index.html`;
    if (path !== '/404') mkdirSync(destination.slice(0, destination.lastIndexOf('/')), { recursive: true });
    writeFileSync(destination, html);
    manifest.push({ path, title: meta.title, canonical: meta.canonical, noindex: meta.noindex });
    if (!meta.noindex && meta.found) sitemap.push(meta.canonical);
  }
  writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  // Portable path redirects for Netlify/Cloudflare Pages. The root 404.html
  // supplies the host's native missing-page response; never rewrite all URLs to 200.
  writeFileSync('dist/_redirects', [
    ...Object.entries(aliases).flatMap(([from, to]) => [`${from} ${to} 301`, `${from}/ ${to} 301`]),
    '',
  ].join('\n'));
  mkdirSync('reports', { recursive: true });
  writeFileSync('reports/seo-build.json', JSON.stringify({ domain: SITE_URL, pages: manifest.length, indexedCandidates: sitemap.length, routes: manifest }, null, 2) + '\n');
  console.log(`Pre-rendered ${manifest.length} pages; sitemap includes ${sitemap.length} content-ready canonical URLs.`);
} finally {
  await server.close();
}

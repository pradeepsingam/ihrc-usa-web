import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';

const manifest = JSON.parse(readFileSync('reports/seo-build.json', 'utf8'));
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Sitemap contains duplicate URLs');
const indexedTitles = new Set();
for (const route of manifest.routes) {
  const file = route.path === '/404' ? 'dist/404.html' : `dist${route.path === '/' ? '' : route.path}/index.html`;
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/<title\b/g) || []).length, 1, `${route.path}: duplicate/missing title`);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${route.path}: duplicate/missing canonical`);
  assert.ok(html.includes(`href="${route.canonical}"`), `${route.path}: canonical mismatch`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route.path}: expected one primary heading`);
  assert.ok(!html.includes('<!--seo-head-->'), `${route.path}: head was not rendered`);
  assert.ok(html.includes('property="og:title"') && html.includes('name="twitter:card"'), `${route.path}: missing social metadata`);
  const json = html.match(/<script type="application\/ld\+json" data-seo>(.*?)<\/script>/s);
  const data = JSON.parse(json?.[1]);
  assert.equal(data['@context'], 'https://schema.org');
  assert.ok(data['@graph'].some(node => node['@type'] === 'Organization'));
  assert.ok(route.canonical.startsWith(manifest.domain + '/'));
  assert.equal(sitemapUrls.includes(route.canonical), !route.noindex, `${route.path}: sitemap/index directive mismatch`);
  assert.equal(html.includes('content="noindex, follow"'), route.noindex, `${route.path}: robots mismatch`);
  if (!route.noindex) {
    assert.ok(!indexedTitles.has(route.title), `${route.path}: duplicate indexable title`);
    indexedTitles.add(route.title);
  }
  const image = html.match(/property="og:image" content="([^"]+)"/)[1];
  if (image.startsWith(manifest.domain + '/')) assert.ok(existsSync('dist' + decodeURIComponent(new URL(image).pathname)), `${route.path}: social image missing`);
}
assert.ok(readFileSync('dist/404.html', 'utf8').includes('Page Not Found'));
assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`Sitemap: ${manifest.domain}/sitemap.xml`));
const redirects = readFileSync('dist/_redirects', 'utf8');
assert.ok(redirects.includes('/apply /membership 301'));
assert.ok(!redirects.includes('/* /index.html 200'));
// Exercise route decisions and CMS input separately from the generated snapshot.
const server = await createServer({ mode: 'production', server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: 'custom' });
try {
  const seo = await server.ssrLoadModule('/src/seo/metadata.js');
  const content = await server.ssrLoadModule('/src/content.js');
  assert.equal(seo.getMetadata('/apply?source=test').canonical, manifest.domain + '/membership');
  assert.equal(seo.getMetadata('/programs/?cat=Education').canonical, manifest.domain + '/programs');
  assert.equal(seo.getMetadata('/news/missing').found, false);
  assert.equal(seo.getMetadata('/member-profile/missing').noindex, true);
  assert.equal(seo.getMetadata('/programs/missing').found, false);
  assert.equal(seo.getMetadata('/contact/extra/segments').found, false);
  content.news.push({ id: 42, title: 'Test </script><script>alert(1)</script>', summary: 'A published update.' });
  const article = seo.getMetadata('/news/42');
  assert.equal(article.found, true, 'Numeric CMS IDs must resolve');
  assert.equal(article.noindex, false);
  assert.ok(seo.getRoutes().includes('/news/42'));
  assert.ok(!seo.headMarkup(article).includes('</script><script>alert'), 'CMS text must not escape metadata/JSON-LD');
  const slug = 'education-for-children';
  assert.equal(seo.getMetadata('/programs/' + slug).noindex, true);
  content.programDetails[slug] = { description: 'Published details about our education program.' };
  assert.equal(seo.getMetadata('/programs/' + slug).noindex, false, 'Published program content should become indexable');
} finally {
  await server.close();
}
console.log(`SEO checks passed: ${manifest.pages} rendered pages, ${sitemapUrls.length} sitemap URLs, consistent metadata, headings, schema, images and index controls.`);

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(projectDir, 'dist/public');
const indexFile = path.join(outputDir, 'index.html');
process.env.NODE_ENV = 'production';

const vite = await createServer({
  configFile: path.join(projectDir, 'vite.config.ts'),
  root: projectDir,
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderSeoHead(page, structuredData, image) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = escapeHtml(page.canonicalUrl);
  const imageAlt = 'Dermi Natural Healthcare skincare and wellness product ranges';
  const jsonLd = JSON.stringify(structuredData).replaceAll('<', '\\u003c');

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<meta name="robots" content="${page.robots}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:type" content="${page.openGraphType}">`,
    `<meta property="og:url" content="${canonical}">`,
    '<meta property="og:site_name" content="Dermi Natural Healthcare Pvt Ltd">',
    '<meta property="og:locale" content="en_IN">',
    `<meta property="og:image" content="${image}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${imageAlt}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<script type="application/ld+json" data-site-structured-data>${jsonLd}</script>`,
  ].join('\n    ');
}

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
  const seo = await vite.ssrLoadModule('/src/lib/seo.ts');
  const template = await fs.readFile(indexFile, 'utf8');
  const routes = seo.getPrerenderPaths();
  const indexableRoutes = seo.getIndexablePaths();

  if (!template.includes('SEO_HEAD_START') || !template.includes('SEO_JSON_LD')) {
    throw new Error('The HTML template is missing its SEO insertion markers.');
  }

  for (const route of routes) {
    const body = renderToString(React.createElement(App, { ssrPath: route }));
    const page = seo.getPageSeo(route);
    const structuredData = seo.getStructuredData(route);
    const head = renderSeoHead(page, structuredData, seo.SOCIAL_IMAGE_URL);
    const html = template
      .replace(
        /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/,
        `<!-- SEO_HEAD_START -->\n    ${head}\n    <!-- SEO_HEAD_END -->`,
      )
      .replace('<!-- SEO_JSON_LD -->', '')
      .replace('<html lang="en">', '<html lang="en" data-static-seo>')
      .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${body}</div>`);

    if (!html.includes('data-prerendered="true"') || !html.includes('data-static-seo')) {
      throw new Error(`Could not inject server-rendered content for ${route}.`);
    }

    const routeFile = route === '/'
      ? indexFile
      : path.join(outputDir, route.slice(1), 'index.html');
    await fs.mkdir(path.dirname(routeFile), { recursive: true });
    await fs.writeFile(routeFile, html);
  }

  const sitemapUrls = indexableRoutes
    .map((route) => `  <url><loc>${seo.getPageSeo(route).canonicalUrl}</loc></url>`)
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\nSitemap: ${seo.SITE_ORIGIN}/sitemap.xml\n`;
  await Promise.all([
    fs.writeFile(path.join(outputDir, 'sitemap.xml'), sitemap),
    fs.writeFile(path.join(outputDir, 'robots.txt'), robots),
  ]);

  console.log(`Pre-rendered ${routes.length} routes and listed ${indexableRoutes.length} canonical URLs in sitemap.xml.`);
} finally {
  await vite.close();
}

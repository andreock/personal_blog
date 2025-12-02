import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'andreock.github.io';
const BASE_PATH = '/personal_blog';
const ROUTES_DIR = join(__dirname, '../src/routes');
const OUTPUT_FILE = join(__dirname, '../static/sitemap.xml');

function getAllRoutes(dir, baseRoute = '') {
  const routes = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !entry.startsWith('+') && !entry.startsWith('_')) {
      const route = `${baseRoute}/${entry}`;
      const hasPage = readdirSync(fullPath).some(file =>
        file === '+page.svelte' || file === '+page.md' || file === '+page.svx'
      );

      if (hasPage) {
        routes.push(route);
      }

      routes.push(...getAllRoutes(fullPath, route));
    }
  }

  return routes;
}

function generateSitemap() {
  const routes = getAllRoutes(ROUTES_DIR);
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add homepage
  sitemap += '  <url>\n';
  sitemap += `    <loc>${SITE_URL}${BASE_PATH}/</loc>\n`;
  sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
  sitemap += '    <changefreq>weekly</changefreq>\n';
  sitemap += '    <priority>1.0</priority>\n';
  sitemap += '  </url>\n';

  // Add all other routes
  routes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${SITE_URL}${BASE_PATH}${route}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>\n';

  writeFileSync(OUTPUT_FILE, sitemap);
  console.log(`✓ Sitemap generated at ${OUTPUT_FILE}`);
  console.log(`✓ Found ${routes.length + 1} routes`);
}

generateSitemap();

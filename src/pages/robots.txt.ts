import type { APIRoute } from 'astro';

/** Generated at build time so the sitemap URL follows the configured `site`. */
export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('`site` must be set in astro.config.ts to generate robots.txt.');
  }

  const sitemapUrl = new URL('sitemap-index.xml', site);
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl.href}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

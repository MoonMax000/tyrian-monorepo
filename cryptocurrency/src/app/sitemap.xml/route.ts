import { getSiteName } from '@/utils/getSiteName';
import { NextResponse } from 'next/server';

const sitename = getSiteName();

const urls = [
  { url: '/home', priority: '1.0' },
  { url: '/fear-and-greed', priority: '1.0' },
  { url: '/alt-season', priority: '1.0' },
  { url: '/btc-dominance', priority: '1.0' },
  { url: '/tracker/eth', priority: '1.0' },
  { url: '/coins/bitcoin', priority: '0.9' },
  { url: '/coins/ethereum', priority: '0.9' },
  { url: '/coins/tether', priority: '0.9' },
];

const urlsSet = urls
  .map(
    ({ url, priority }) => `  <url>\n    <loc>${sitename}${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join('\n');

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsSet}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
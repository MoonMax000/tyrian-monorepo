import { getSiteName } from '@/utilts/getSiteName';
import { NextResponse } from 'next/server';

const sitename = getSiteName();

const urls = [
  '/popular',
  '/new',
  '/for-us',
  '/favorites',
  '/chats',
  '/ideas',
  '/scripts',
  '/video',
  '/discussed',
];

const urlsSet = urls
    .map(
      (url) => `  <url>\n    <loc>${sitename}${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`
    )
    .join('\n')

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
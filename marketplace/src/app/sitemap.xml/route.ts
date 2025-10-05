import { getSiteName } from '@/utils/getSiteName';
import { NextResponse } from 'next/server';

const sitename = getSiteName();

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${sitename}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 
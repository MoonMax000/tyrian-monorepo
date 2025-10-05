export const dynamic = "force-dynamic"; // Отключает статическую генерацию

import getAllStocks from '@/api/stocks/getAllMarketLeadersGrowth';
import { getSiteName } from '@/utils/getSiteName';
import { NextResponse } from 'next/server';

const sitename = getSiteName();

export async function GET() {
  const { data } = await getAllStocks();

  const urlsXml = data.map(({ symbol }) => {
    return `  <url>\n    <loc>${sitename}/stock/${symbol}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>`;
  }).join('\n');
  
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
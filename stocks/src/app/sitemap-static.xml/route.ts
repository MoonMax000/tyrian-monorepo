import { NextResponse } from 'next/server';
import { getSiteName } from '@/utils/getSiteName';

const urls = [
  '/',
  '/stocks-comparison',
  '/dividends-schedule',
  '/events-calendar',
  '/market-news',
  '/portfolios',
  '/research',
  '/volume',
  '/volatility',
  '/height',
  '/fall',
  '/table/etf',
  '/table/gdp',
  '/table/country-companies',
  '/table/prices',
  '/table/employment-of-population',
  '/table/fut&com', // Данный url ломает 
];

const sitename = getSiteName();

const urlsXml = urls.map((path) => {
  const priority = path === '/' ? '1.0' : '0.9';
  return `  <url>\n    <loc>${sitename}${path}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 
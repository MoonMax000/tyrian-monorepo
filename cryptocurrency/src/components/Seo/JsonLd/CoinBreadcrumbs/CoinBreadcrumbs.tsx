import { getSiteName } from "@/utils/getSiteName";
import React from "react";

interface CoinData {
  name: string;
  symbol: string;
  slug: string;
}

interface Props {
  coin: CoinData;
}

export const CoinBreadcrumbs: React.FC<Props> = ({ coin }) => {
  const sitename = getSiteName();
  const baseUrl = `${sitename}/coins/${coin.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Coin Market Cap",
        item: `${sitename}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `💰 ${coin.name}`,
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `📊 ${coin.symbol} Price Chart`,
        item: `${baseUrl}#chart`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
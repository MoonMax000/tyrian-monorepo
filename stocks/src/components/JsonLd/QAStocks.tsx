import React from "react";

interface QAStocksProps {
  ticker: string;
  company: string;
}

const QAStocks: React.FC<QAStocksProps> = ({ ticker, company }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "datePublished": "2025-05-13T12:34-03:00",
      "name": `${company} (${ticker}) Stock`,
      "text": `Did Our ${ticker} Data Help You?`,
      "author": {
        "@type": "Person",
        "name": "Cassius Traderz"
      },
      "acceptedAnswer": {
        "@type": "Answer",
        "author": {
          "@type": "Organization",
          "name": "Tyrian Trade"
        },
        "text": `📈 Thanks, it helped me! ⚡ Live ${ticker} quotes are very useful! Special thanks for the latest market news!`
      },
      "answerCount": 1
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </script>
  );
};

export default QAStocks;
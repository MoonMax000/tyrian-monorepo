interface QAPageProps {
  title: string;        // Название (Аббревиатура) Data
  abbreviation: string; // Аббревиатура
}

export const CoinsQA: React.FC<QAPageProps> = ({
  title,
  abbreviation,
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "datePublished": "2025-05-13T12:34-03:00",
      "name": title,
      "text": `Did Our ${abbreviation} Data Help You?`,
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
        "text": `📈 Thanks, it helped me! ⚡ Live ${abbreviation} data is very useful! 🏆 Special thanks for the latest news!`,
      },
      "answerCount": 1
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
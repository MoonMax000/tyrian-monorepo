import getStockById, { StockData } from '@/api/stocks/getStockById';
import { BreadcrumbsJsonLd } from '@/components/BreadcrumbsJsonLd/BreadcrumbsJsonLd';
import QAStocks from '@/components/JsonLd/QAStocks';
import HomeScreen from '@/screens/HomeScreen';
import { getSiteName } from '@/utils/getSiteName';
import { Metadata } from 'next';

const siteName = getSiteName();

type Params = {
  params: Promise<{ stockName: string }>;
};

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
  const param = await params;

  const data = (await getStockById(param.stockName).catch((e) =>
    console.error('Error fetching stock data:', e),
  ))!.data;

  const title = `${data.name} (${data.symbol}) Stock | Price Today & History, Latest News`;

  const description = `❱❱❱ Real-time ${data.name} (${data.symbol}) Stock Price & Quote History. ⚡ Latest News & Insights About ${data.name}. ⭐ Dividend Timeline and Yield. ✨ Everything for Informed ${data.symbol} Trading & Investing`;

  return { title, description };
};

const getBreadcrumbs = (stockName: string, { name, symbol }: StockData) => [
  {
    name: 'Stock Research & Analytics Platform',
    item: siteName,
  },
  {
    name: `🏢 ${name}`,
    item: `https:/${siteName}/stock/${stockName}`,
  },
  {
    name: `📈 ${symbol} Price & Chart`,
    item: `https:/${siteName}/stock/${stockName}#chart`,
  },
];

export default async function Stock({ params }: Params) {
  const { stockName } = await params;
  const { data } = await getStockById(stockName);
  const breadcrumbs = getBreadcrumbs(stockName, data);

  return (
    <>
      <BreadcrumbsJsonLd breadcrumbs={breadcrumbs} />
      <QAStocks ticker={data.symbol} company={data.name} />
      <HomeScreen stockName={stockName} />
    </>
  );
}

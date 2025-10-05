import { getCoinInfo } from '@/api/volctrade/getCoin';
import CoinScreen from '@/screens/CoinScreen';
import { Metadata } from 'next';
import {CoinBreadcrumbs} from '@/components/Seo/JsonLd/CoinBreadcrumbs/CoinBreadcrumbs';
import {CoinsQA} from '@/components/Seo/JsonLd/CoinsQA/CoinsQA';

interface Props {
  params: Promise<{
    symbol: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol: slug } = await params;
  const { name, symbol } = await getCoinInfo(slug);

  const title = `${name} ${symbol} | Price Today & History, Chart & News`;
  const description = `❱❱❱ Real-time ${name} (${symbol}) Price Chart & Historical Data. ⚡ ${symbol} Market Cap, Volume (24H), Total Supply. ⭐ ${symbol} Liquidations Across Exchanges. ✨ Everything for Informed ${symbol} Trading & Investing`;

  return {
    title, 
    description,
  };
}



const Page = async ({ params, searchParams }: Props) => {
  const { symbol: slug } = await params;
  const { symbol: querySymbol } = await searchParams;
  const { name, symbol } = await getCoinInfo(slug);

  return <>
    <CoinBreadcrumbs coin={{ name, symbol, slug }} />
    <CoinsQA title={`${name} (${symbol}) Data`} abbreviation={symbol} />
    <CoinScreen slug={slug} symbol={querySymbol as string} />
  </>;
};

export default Page;
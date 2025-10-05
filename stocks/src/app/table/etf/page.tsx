import LeadersTable from '@/components/Tables/LeadersTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ETF',
};

const data = [
  {
    symbol: 'STSS',
    name: 'Sharps Technology, Inc.',
    volume: 379357098,
    changesPercentage: 20.75472,
    icon: '/media/company_icons/STSS.png',
    price: 0.032,
  },
  {
    symbol: 'DMN',
    name: 'Damon Inc. Common Stock',
    volume: 350432527,
    changesPercentage: 9.67742,
    icon: '/media/company_icons/DMN.png',
    price: 0.0034,
  },
  {
    symbol: 'SUNE',
    name: 'SUNation Energy Inc.',
    volume: 327504185,
    changesPercentage: 2.04082,
    icon: '/media/company_icons/SUNE.png',
    price: 0.02,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    volume: 290021924,
    changesPercentage: -2.87109,
    icon: '/media/company_icons/NVDA.png',
    price: 101.49,
  },
  {
    symbol: 'HTZ',
    name: 'Hertz Global Holdings, Inc.',
    volume: 262578113,
    changesPercentage: 44.30823,
    icon: '/media/company_icons/HTZ.png',
    price: 8.24,
  },
  {
    symbol: 'SOXL',
    name: 'Direxion Daily Semiconductor Bull 3X Shares',
    volume: 230802793,
    changesPercentage: -1.49893,
    icon: '/media/company_icons/SOXL.png',
    price: 9.2,
  },
  {
    symbol: 'FMTO',
    name: 'Femto Technologies Inc.',
    volume: 189116767,
    changesPercentage: -35.81081,
    icon: '/media/company_icons/FMTO.png',
    price: 0.019,
  },
  {
    symbol: 'RTC',
    name: 'Baijiayun Group Ltd',
    volume: 185147141,
    changesPercentage: 72.09302,
    icon: '/media/company_icons/RTC.png',
    price: 0.37,
  },
  {
    symbol: 'PLUG',
    name: 'Plug Power Inc.',
    volume: 128657130,
    changesPercentage: -2.25817,
    icon: '/media/company_icons/PLUG.png',
    price: 0.9003,
  },
  {
    symbol: 'F',
    name: 'Ford Motor Company',
    volume: 124620305,
    changesPercentage: 2.44681,
    icon: '/media/company_icons/F.png',
    price: 9.63,
  },
  {
    symbol: 'ADGM',
    name: 'Adagio Medical Holdings, Inc.',
    volume: 114903360,
    changesPercentage: 92.80763,
    icon: '/media/company_icons/ADGM.png',
    price: 1.78,
  },
  {
    symbol: 'SQQQ',
    name: 'ProShares UltraPro Short QQQ',
    volume: 100885817,
    changesPercentage: 0.25947,
    icon: '/media/company_icons/SQQQ.png',
    price: 38.64,
  },
  {
    symbol: 'TQQQ',
    name: 'ProShares UltraPro QQQ',
    volume: 99883192,
    changesPercentage: -0.28704,
    icon: '/media/company_icons/TQQQ.png',
    price: 45.16,
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    volume: 85101038,
    changesPercentage: -1.56006,
    icon: '/media/company_icons/INTC.png',
    price: 18.93,
  },
  {
    symbol: 'TSLL',
    name: 'Direxion Daily TSLA Bull 1.5X Shares',
    volume: 84303353,
    changesPercentage: -0.26008,
    icon: '/media/company_icons/TSLL.png',
    price: 7.67,
  },
  {
    symbol: 'SPXS',
    name: 'Direxion Daily S&P 500 Bear 3X Shares',
    volume: 83661775,
    changesPercentage: 0.12953,
    icon: '/media/company_icons/SPXS.png',
    price: 7.73,
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    volume: 83433992,
    changesPercentage: 1.15414,
    icon: '/media/company_icons/PLTR.png',
    price: 93.78,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    volume: 82262821,
    changesPercentage: -0.07451873,
    icon: '/media/company_icons/TSLA.png',
    price: 241.37,
  },
  {
    symbol: 'TSLZ',
    name: 'T-Rex 2X Inverse Tesla Daily Target ETF',
    volume: 78606624,
    changesPercentage: -0.1368,
    icon: '/media/company_icons/TSLZ.png',
    price: 3.65,
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    volume: 74881787,
    changesPercentage: 0.14268,
    icon: '/media/company_icons/SPY.png',
    price: 526.41,
  },
  {
    symbol: 'LGMK',
    name: 'LogicMark, Inc.',
    volume: 72574711,
    changesPercentage: -3.09278,
    icon: '/media/company_icons/LGMK.png',
    price: 0.0094,
  },
  {
    symbol: 'ABEV',
    name: 'Ambev S.A.',
    volume: 69769561,
    changesPercentage: 3.00429,
    icon: '/media/company_icons/ABEV.png',
    price: 2.4,
  },
  {
    symbol: 'NVDQ',
    name: 'T-Rex 2X Inverse NVIDIA Daily Target ETF',
    volume: 69694154,
    changesPercentage: 6.24071,
    icon: '/media/company_icons/NVDQ.png',
    price: 3.575,
  },
  {
    symbol: 'LCID',
    name: 'Lucid Group, Inc.',
    volume: 68192773,
    changesPercentage: 3.0303,
    icon: '/media/company_icons/LCID.png',
    price: 2.38,
  },
  {
    symbol: 'AREC',
    name: 'American Resources Corporation',
    volume: 64859343,
    changesPercentage: 16.21622,
    icon: '/media/company_icons/AREC.png',
    price: 1.29,
  },
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'ETF'}</h3>
      <LeadersTable data={data} />
    </Container>
  );
};

export default Volume;

import LeadersTable from '@/components/Tables/LeadersTable';
import Container from '@/components/UI/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futures & Commodities',
};

const data = [
  {
    symbol: 'ARM',
    name: 'Arm Holdings plc American Depositary Shares',
    price: 100.73,
    beta: 4.5002356,
    icon: '/media/company_icons/ARM.png',
    changesPercentage: -0.26733,
  },
  {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    price: 175.03,
    beta: 3.654,
    icon: '/media/company_icons/COIN.png',
    changesPercentage: 1.63754,
  },
  {
    symbol: 'CVNA',
    name: 'Carvana Co.',
    price: 211.41,
    beta: 3.617,
    icon: '/media/company_icons/CVNA.png',
    changesPercentage: 1.00812,
  },
  {
    symbol: 'IBIT',
    name: 'iShares Bitcoin Trust',
    price: 48.26,
    beta: 3.478346,
    icon: '/media/company_icons/IBIT.png',
    changesPercentage: 0.62552,
  },
  {
    symbol: 'MSTR',
    name: 'MicroStrategy Incorporated',
    price: 317.2,
    beta: 3.474,
    icon: '/media/company_icons/MSTR.png',
    changesPercentage: 1.77758,
  },
  {
    symbol: 'STRK',
    name: 'MicroStrategy Incorporated',
    price: 85.15,
    beta: 3.474,
    icon: '/media/company_icons/STRK.png',
    changesPercentage: 0.25904,
  },
  {
    symbol: 'SHOP.TO',
    name: 'Shopify Inc.',
    price: 116.03,
    beta: 2.825,
    icon: '/media/company_icons/SHOP.TO.png',
    changesPercentage: -0.47178,
  },
  {
    symbol: 'SHOP',
    name: 'Shopify Inc.',
    price: 83.65,
    beta: 2.825,
    icon: '/media/company_icons/SHOP.png',
    changesPercentage: -0.36922,
  },
  {
    symbol: 'XYZ',
    name: 'Block, Inc.',
    price: 53.9,
    beta: 2.771,
    icon: '/media/company_icons/XYZ.png',
    changesPercentage: 0.27907,
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    price: 93.78,
    beta: 2.741,
    icon: '/media/company_icons/PLTR.png',
    changesPercentage: 1.15414,
  },
  {
    symbol: 'XPEV',
    name: 'XPeng Inc.',
    price: 18.22,
    beta: 2.615,
    icon: '/media/company_icons/XPEV.png',
    changesPercentage: -2.61892,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 241.37,
    beta: 2.58,
    icon: '/media/company_icons/TSLA.png',
    changesPercentage: -0.07451873,
  },
  {
    symbol: 'APP',
    name: 'AppLovin Corporation',
    price: 238.22,
    beta: 2.391,
    icon: '/media/company_icons/APP.png',
    changesPercentage: 3.65954,
  },
  {
    symbol: 'RCL',
    name: 'Royal Caribbean Cruises Ltd.',
    price: 192.69,
    beta: 2.271,
    icon: '/media/company_icons/RCL.png',
    changesPercentage: 0.51643,
  },
  {
    symbol: 'HOOD',
    name: 'Robinhood Markets, Inc.',
    price: 41.18,
    beta: 2.178,
    icon: '/media/company_icons/HOOD.png',
    changesPercentage: 1.2789,
  },
  {
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury Bond ETF',
    price: 87.53,
    beta: 2.17,
    icon: '/media/company_icons/TLT.png',
    changesPercentage: -0.88325,
  },
  {
    symbol: 'BN.TO',
    name: 'Brookfield Corporation',
    price: 68.81,
    beta: 2.08,
    icon: '/media/company_icons/BN.TO.png',
    changesPercentage: 1.63959,
  },
  {
    symbol: 'BN',
    name: 'Brookfield Corporation',
    price: 49.7,
    beta: 2.08,
    icon: '/media/company_icons/BN.png',
    changesPercentage: 1.78169,
  },
  {
    symbol: 'BAM.TO',
    name: 'Brookfield Asset Management Ltd.',
    price: 67.2,
    beta: 1.974,
    icon: '/media/company_icons/BAM.TO.png',
    changesPercentage: 0.94637,
  },
  {
    symbol: 'BAM',
    name: 'Brookfield Asset Management Ltd.',
    price: 48.59,
    beta: 1.974,
    icon: '/media/company_icons/BAM.png',
    changesPercentage: 1.25026,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 101.49,
    beta: 1.958,
    icon: '/media/company_icons/NVDA.png',
    changesPercentage: -2.87109,
  },
  {
    symbol: 'CVE.TO',
    name: 'Cenovus Energy Inc.',
    price: 16.75,
    beta: 1.926,
    icon: '/media/company_icons/CVE.TO.png',
    changesPercentage: 3.65099,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    price: 87.5,
    beta: 1.885,
    icon: '/media/company_icons/AMD.png',
    changesPercentage: -0.89478,
  },
  {
    symbol: 'HUBS',
    name: 'HubSpot, Inc.',
    price: 539.69,
    beta: 1.821,
    icon: '/media/company_icons/HUBS.png',
    changesPercentage: -0.79957,
  },
  {
    symbol: 'MRVL',
    name: 'Marvell Technology, Inc.',
    price: 51.7,
    beta: 1.777,
    icon: '/media/company_icons/MRVL.png',
    changesPercentage: -0.4429,
  },
];

const Volume = () => {
  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{'Futures & Commodities'}</h3>
      <LeadersTable data={data} />
    </Container>
  );
};

export default Volume;

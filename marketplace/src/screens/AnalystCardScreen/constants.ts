import mockCompanyImg from 'public/mockIcons/29.png';
import analystImg from '@/assets/mock-profile-avatar-squared.png';

export const mockAnalystCard = {
  name: 'Sarah Lee',
  role: 'Hedge fund manager',
  avatar: analystImg.src,
  assets: ['BTC', 'ETH', 'Tesla', 'Gold'],
  analysis: 'Technical & Fundamental Analysis',
  markets: ['Binance', 'NASDAQ'],
  clients: 983,
  subscribers: 15.054,
  rating: 5,
  accuracy: 68,
  price: 10,
  isPro: true,
};

export const mockAnalystCardInfo = {
  followers: 85,
  tradingDays: 438,
  stabilityIndex: 5.0,
  weekViews: 776,
  aum: 210390.4,
  totalAssets: 25020.85,
  profitSharing: 10,
  tags: ['Stable', 'High Frequency', 'Long-Term', 'Veterans', 'Sociable'],
};

export const mockPortfolioGain = {
  oneMonth: 0.14,
  sixMonth: 0.14,
  year: 0.14,
  ytd: 0.14,
  total: 0.14,
};

export const expertMock = {
  name: 'Sarah Lee',
  avatar: analystImg.src,
  description:
    'Professional trader with 8+ years of experience in momentum strategies and technical analysis.',
  tags: [
    'Distribution',
    'Luxaigo',
    'signals',
    'statisticalprobability',
    'statistics',
    'Stop',
    'trailingstop',
    'trendanalysis',
  ],
  isPro: true,
};

const now = new Date();

const twoHoursEarlier = new Date(new Date(now).setHours(now.getHours() - 2)).toISOString();

const oneWeekEarlier = new Date(new Date(now).setDate(now.getDate() - 7)).toISOString();

const threeWeeksEarlier = new Date(new Date(now).setDate(now.getDate() - 3 * 7)).toISOString();

export const mockBestTrades = {
  asset: 'Broadcom (AVGO)',
  openedAt: now.toISOString(),
  closedAt: null,
  gain: 718,
};

export const mockReviews = [
  {
    user: {
      name: 'John Smith',
      avatar: '/avatars/profile.svg',
    },
    rating: 5,
    date: twoHoursEarlier,
    title: 'Game changer for my trading strategy!',
    review: `This tool has completely transformed how I manage risk in my trading. The automatic calculations save me so much time, and I’ve seen a significant improvement in my overall performance. Highly recommended for any serious trader.`,
  },
  {
    user: {
      name: 'John Smith',
      avatar: '/avatars/profile.svg',
    },
    rating: 4,
    date: oneWeekEarlier,
    title: 'Great tool, but could use more features',
    review: `RiskMaster has been very helpful for my day trading. The risk calculations are spot on and have helped me avoid some potentially big losses. I’d love to see more advanced features in future updates, like custom risk models and better integration with other platforms.`,
  },
  {
    user: {
      name: 'John Smith',
      avatar: '/avatars/profile.svg',
    },
    rating: 4.5,
    date: threeWeeksEarlier,
    title: 'Worth every penny',
    review: `I was hesitant about the price at first, but after using Riskmaster for a month, I can confidently say it’s worth every penny. The portfolio analysis feature alone has saved me from making several costly mistakes. The UI is clean and intuitive, making it easy to incorporate into my daily routine.`,
  },
];

export const mockPortfolioTable = new Array(10).fill({
  companyImg: mockCompanyImg.src,
  companyName: 'LENZOLOTO',
  companyShortName: 'LNZL',
  hold: 0,
  returnNum: 15.22,
  trnx: 1,
  lastTrnx: 'OPEN',
  date: now.toISOString(),
});

import type { Slide } from '@/components/UI/Slider';

const now = new Date();

const twoHoursEarlier = new Date(new Date(now).setHours(now.getHours() - 2)).toISOString();

const oneWeekEarlier = new Date(new Date(now).setDate(now.getDate() - 7)).toISOString();

const threeWeeksEarlier = new Date(new Date(now).setDate(now.getDate() - 3 * 7)).toISOString();

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

export const mockDetails = {
  type: 'Script',
  category: 'Other',
  platform: 'Windows/Mac',
  industry: 'Automation',
};

export const mockScript = {
  price: 49.99,
  tags: ['Automation', 'risk_management', 'trading', 'script', 'optimization'],
  rating: 4.5,
  reviews: 28,
  views: 1245,
};

export const expertMock = {
  name: 'John Smith',
  avatar: '/avatars/profile.svg',
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

export const mockSlides = [
  {
    id: 0,
    content: (
      <div className='text-center w-full h-full bg-[url(/background/nvidia.png)] bg-cover rounded-lg'></div>
    ),
    background: 'bg-gradient-to-r from-blue-500 to-teal-400',
  },
  {
    id: 1,
    content: (
      <div className='text-center w-full h-full bg-[url(/background/slide2.png)] bg-cover rounded-lg'></div>
    ),
    background: 'bg-gradient-to-r from-blue-500 to-teal-400',
  },
] satisfies Slide[];

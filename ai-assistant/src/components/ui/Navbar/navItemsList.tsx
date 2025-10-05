import AIAssistant from '@/assets/Navbar/AIAssistant.svg';
import AltSeasonIndex from '@/assets/Navbar/AltSeasonIndex.svg';
import BTCDominance from '@/assets/Navbar/BTCDominance.svg';
import Calendar from '@/assets/Navbar/Calendar.svg';
import Cryptocurrency from '@/assets/Navbar/Cryptocurrency.svg';
import CryptocurrnecyTitle from '@/assets/Navbar/CryptocurrnecyTitle.svg';
import FearAndGreed from '@/assets/Navbar/FearAndGreed.svg';
import LiveStreaming from '@/assets/Navbar/LiveStreaming.svg';
import Markets from '@/assets/Navbar/Markets.svg';
import Portfolios from '@/assets/Navbar/Portfolios.svg';
import Research from '@/assets/Navbar/Research.svg';
import SocialNetwork from '@/assets/Navbar/SocialNetwork.svg';
import StockMarket from '@/assets/Navbar/StockMarket.svg';
import StockScreener from '@/assets/Navbar/StockScreener.svg';
import Terminal from '@/assets/Navbar/Terminal.svg';
import MarketPlace from '@/assets/Navbar/MarketPlace.svg';
import DividendCalendar from '@/assets/Navbar/DividendCalendar.svg';
import API from '@/assets/DashboardNavbar/API.svg';
import Billing from '@/assets/DashboardNavbar/Billing.svg';
import Dashboard from '@/assets/DashboardNavbar/Dashboard.svg';
import KYC from '@/assets/DashboardNavbar/KYC.svg';
import Notifications from '@/assets/DashboardNavbar/Notifications.svg';
import Profile from '@/assets/DashboardNavbar/Profile.svg';
import Referrals from '@/assets/DashboardNavbar/Referrals.svg';
import Security from '@/assets/DashboardNavbar/Security.svg';
import { LayoutVariant } from '../AppBackground/AppBackGround';
import { NavItem } from './Navbar';

export const navItemsList: Record<LayoutVariant, NavItem[]> = {
  primal: [
    { id: '0', label: 'Stock Screener', icon: <StockScreener /> },
    { id: '1', label: 'Dividend calendar', icon: <DividendCalendar /> },
    { id: '2', label: 'Events calendar', icon: <Calendar /> },
    { id: '3', label: 'Markets', icon: <Markets /> },
    { id: '4', label: 'Portfolios', icon: <Portfolios /> },
    { id: '5', label: 'Research', icon: <Research /> },
    {
      id: '6',
      label: 'PRODUCTS',
      children: [
        { 
          id: '7', 
          label: 'Stock Market', 
          icon: <StockMarket />, 
          href: 'http://localhost:3002',
          children: [
            { id: '71', label: 'Portfolios', href: 'http://localhost:3002/portfolios' },
            { id: '72', label: 'My Portfolios', href: 'http://localhost:3002/my-portfolios' },
            { id: '73', label: 'Events Calendar', href: 'http://localhost:3002/events-calendar' },
            { id: '74', label: 'Dividends Schedule', href: 'http://localhost:3002/dividends-schedule' },
            { id: '75', label: 'Market News', href: 'http://localhost:3002/market-news' },
            { id: '76', label: 'Research', href: 'http://localhost:3002/research' },
          ],
        },
        {
          id: '8',
          label: 'Cryptocurrency',
          icon: <CryptocurrnecyTitle />,
          href: 'http://localhost:3003',
          children: [
            { id: '9', label: 'Fear and Greed', icon: <FearAndGreed />, href: 'http://localhost:3003/fear-and-greed' },
            { id: '10', label: 'Altseason Index', icon: <AltSeasonIndex />, href: 'http://localhost:3003/alt-season' },
            { id: '11', label: 'BTC Dominance', icon: <BTCDominance />, href: 'http://localhost:3003/btc-dominance' },
            { id: '12', label: 'Top Gainers', href: 'http://localhost:3003/lists/top-gainers' },
            { id: '13', label: 'Top Losers', href: 'http://localhost:3003/lists/top-losers' },
            { id: '14', label: 'Volume Leaders', href: 'http://localhost:3003/lists/volume-leaders' },
          ],
        },
        { 
          id: '15', 
          label: 'Social Network', 
          icon: <SocialNetwork />, 
          href: 'http://localhost:3001',
          children: [
            { id: '151', label: 'New Posts', href: 'http://localhost:3001/new' },
            { id: '152', label: 'Popular', href: 'http://localhost:3001/popular' },
            { id: '153', label: 'For You', href: 'http://localhost:3001/for-us' },
            { id: '154', label: 'Ideas', href: 'http://localhost:3001/ideas' },
            { id: '155', label: 'Discussed', href: 'http://localhost:3001/discussed' },
            { id: '156', label: 'Favorites', href: 'http://localhost:3001/favorites' },
            { id: '157', label: 'Chats', href: 'http://localhost:3001/chats' },
          ],
        },
        { 
          id: '16', 
          label: 'Marketplace', 
          icon: <MarketPlace />, 
          href: 'http://localhost:3005',
          children: [
            { id: '161', label: 'Signals & Indicators', href: 'http://localhost:3005/signals-tab' },
            { id: '162', label: 'Strategies', href: 'http://localhost:3005/strategies-tab' },
            { id: '163', label: 'Robots & Algorithms', href: 'http://localhost:3005/robots-tab' },
            { id: '164', label: 'Consultants', href: 'http://localhost:3005/consultants-tab' },
            { id: '165', label: 'Traders', href: 'http://localhost:3005/traders-tab' },
            { id: '166', label: 'Analysts', href: 'http://localhost:3005/analystys-tab' },
            { id: '167', label: 'Scripts', href: 'http://localhost:3005/scripts-tab' },
            { id: '168', label: 'Courses', href: 'http://localhost:3005/courses-tab' },
            { id: '169', label: 'Popular', href: 'http://localhost:3005/popular-tab' },
            { id: '170', label: 'Favorites', href: 'http://localhost:3005/favorites-tab' },
          ],
        },
        { id: '17', label: 'Live Streaming', icon: <LiveStreaming />, href: 'http://localhost:3004' },
        { 
          id: '18', 
          label: 'AI Assistant', 
          icon: <AIAssistant />, 
          href: 'http://localhost:3006',
          children: [
            { id: '181', label: 'Dashboard', href: 'http://localhost:3006/dashboard' },
            { id: '182', label: 'Profile', href: 'http://localhost:3006/profile' },
            { id: '183', label: 'Live Streaming', href: 'http://localhost:3006/live-streaming' },
            { id: '184', label: 'Billing', href: 'http://localhost:3006/billing' },
            { id: '185', label: 'Security', href: 'http://localhost:3006/security' },
            { id: '186', label: 'Notifications', href: 'http://localhost:3006/notifications' },
          ],
        },
        { id: '19', label: 'Portfolios', icon: <Portfolios /> },
        { id: '20', label: 'Calendar', icon: <Calendar /> },
        { id: '21', label: 'Terminal(DEMO)', icon: <Terminal />, href: 'http://localhost:8061' },
      ],
    },
  ],
  secondary: [
   {id: '0',
        label: 'Dashboard',
        icon: <Dashboard />,
         href: '/dashboard',
        children: [
          { id: '1', label: 'Profile', icon: <Profile />, href: '/profile_settings'},
          { id: '2', label: 'Security', icon: <Security />, href: '/security' },
          { id: '3', label: 'Notifications', icon: <Notifications />, href: '/notifications' },
          { id: '4', label: 'Billing', icon: <Billing />, href: '/billing' },
          { id: '5', label: 'Referrals', icon: <Referrals />,  href: '/referrals' },
          { id: '6', label: 'API', icon: <API />,  href: '/api' },
          { id: '7', label: 'KYC', icon: <KYC />, href: '/kyc' },
        ],
    },
  {
    id: '8',
    label: 'PRODUCTS',
    children: [
      {
        id: '9',
        label: 'Stock Market',
        icon: <StockMarket />,
        href: 'http://localhost:3002',
        children: [],
      },
      {
        id: '10',
        label: 'Cryptocurrency',
        icon: <CryptocurrnecyTitle />,
        href: 'http://localhost:3003',
        children: [
          { id: '11', label: 'Fear and Greed', icon: <FearAndGreed /> },
          { id: '12', label: 'Altseason Index', icon: <AltSeasonIndex /> },
          { id: '13', label: 'BTC Dominance', icon: <BTCDominance /> },
          { id: '14', label: 'Cryptocurrency', icon: <Cryptocurrency /> },
        ],
      },
      { id: '15', label: 'Social Network', icon: <SocialNetwork />, href: 'http://localhost:3001', children: [] },
      { id: '16', label: 'Marketplace', icon: <MarketPlace />, href: 'http://localhost:3005', children: [] },
      { id: '17', label: 'Live Streaming', icon: <LiveStreaming />, href: 'http://localhost:3004', children: [] },
      { id: '18', label: 'AI Assistant', icon: <AIAssistant />, href: 'http://localhost:3006', children: [] },
      { id: '19', label: 'Portfolios', icon: <Portfolios />, children: [] },
      { id: '20', label: 'Calendar', icon: <Calendar />, children: [] },
      { id: '21', label: 'Terminal(DEMO)', icon: <Terminal />, href: 'http://localhost:8061', children: [] },
    ],
  },
  ],
};
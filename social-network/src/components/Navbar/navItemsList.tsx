import { LayoutVariant, NavItemType } from './navbarTypes';
import AIAssistant from '@/assets/icons/navbar/AIAssistant.svg';
import AltSeasonIndex from '@/assets/icons/navbar/AltSeasonIndex.svg';
import BTCDominance from '@/assets/icons/navbar/BTCDominance.svg';
import Calendar from '@/assets/icons/navbar/Calendar.svg';
import Cryptocurrency from '@/assets/icons/navbar/Cryptocurrency.svg';
import CryptocurrnecyTitle from '@/assets/icons/navbar/CryptocurrnecyTitle.svg';
import FearAndGreed from '@/assets/icons/navbar/FearAndGreed.svg';
import LiveStreaming from '@/assets/icons/navbar/LiveStreaming.svg';
import Markets from '@/assets/icons/navbar/Markets.svg';
import Portfolios from '@/assets/icons/navbar/Portfolios.svg';
import Research from '@/assets/icons/navbar/Research.svg';
import SocialNetwork from '@/assets/icons/navbar/SocialNetwork.svg';
import StockMarket from '@/assets/icons/navbar/StockMarket.svg';
import StockScreener from '@/assets/icons/navbar/StockScreener.svg';
import Terminal from '@/assets/icons/navbar/Terminal.svg';
import MarketPlace from '@/assets/icons/navbar/MarketPlace.svg';
import DividendCalendar from '@/assets/icons/navbar/DividendCalendar.svg';
import UserGroup from '@/assets/icons/navbar/UserGroup.svg';
import ChartTwo from '@/assets/icons/navbar/chart.svg';
import Chip from '@/assets/icons/navbar/Chip.svg';
import CodeScuare from '@/assets/icons/navbar/CodeScuare.svg';
import FolderLibary from '@/assets/icons/navbar/FolderLibary.svg';
import ChatsIcon from '@/assets/icons/navbar/chatsIcon.svg';
import IdeasIcon from '@/assets/icons/navbar/ideasIcon.svg';
import OpinionsIcon from '@/assets/icons/navbar/opinionsIcon.svg';
import AnalyticsIcon from '@/assets/icons/navbar/analyticsIcon.svg';
import SoftwaresIcon from '@/assets/icons/navbar/softwaresIcon.svg';

export const navItemsList: Record<LayoutVariant, NavItemType[]> = {
  primal: [
    { id: '0', label: 'Stock Screener', icon: <StockScreener /> },
    { id: '1', label: 'Dividend calendar', icon: <DividendCalendar /> },
    { id: '2', label: 'Events calendar', icon: <Calendar /> },
    {
      id: '3',
      label: 'Markets',
      icon: <Markets />,
    },
    { id: '4', label: 'Portfolios', icon: <Portfolios /> },
    { id: '5', label: 'Research', icon: <Research /> },
    {
      id: '6',
      label: 'PRODUCTS',
      children: [
        { id: '7', label: 'Stock Market', icon: <StockMarket /> },
        {
          id: '8',
          label: 'Cryptocurrency',
          icon: <CryptocurrnecyTitle />,
          children: [
            { id: '9', label: 'Fear and Greed', icon: <FearAndGreed /> },
            { id: '10', label: 'Altseason Index', icon: <AltSeasonIndex /> },
            { id: '11', label: 'BTC Dominance', icon: <BTCDominance /> },
            { id: '12', label: 'Cryptocurrency', icon: <Cryptocurrency /> },
          ],
        },
        {
          id: '13',
          label: 'Social Network',
          icon: <SocialNetwork />,
          children: [
            { id: '40', label: 'Chats', icon: <ChatsIcon />, href: '/chats', badge: 920 },
            { id: '41', label: 'Ideas', icon: <IdeasIcon /> },
            { id: '42', label: 'Opinions', icon: <OpinionsIcon /> },
            { id: '43', label: 'Analytics', icon: <AnalyticsIcon /> },
            { id: '44', label: 'Softwares', icon: <SoftwaresIcon /> },
          ],
        },
        {
          id: '14',
          label: 'Marketplace',
          icon: <MarketPlace />,
          children: [
            { id: '31', label: 'Signals/Indicators', icon: <ChartTwo /> },
            { id: '32', label: 'Strategies/Protfolio', icon: <Portfolios /> },
            { id: '33', label: 'Robots/Algorithms', icon: <Chip /> },
            { id: '34', label: 'Consultants', icon: <UserGroup /> },
            { id: '35', label: 'Traders', icon: <UserGroup /> },
            { id: '36', label: 'Analysts', icon: <UserGroup /> },
            { id: '37', label: 'Scripts/Software', icon: <CodeScuare /> },
            { id: '38', label: 'Courses/Trainings', icon: <Research /> },
            { id: '39', label: 'Other', icon: <FolderLibary /> },
          ],
        },
        { id: '15', label: 'Live Streaming', icon: <LiveStreaming /> },
        { id: '16', label: 'AI Assistant', icon: <AIAssistant /> },
        { id: '17', label: 'Portfolios', icon: <Portfolios /> },
        { id: '18', label: 'Calendar', icon: <Calendar /> },
        { id: '19', label: 'Terminal(DEMO)', icon: <Terminal /> },
      ],
    },
  ],
  secondary: [
    {
      id: '8',
      label: 'PRODUCTS',
      children: [
        {
          id: '9',
          label: 'Stock Market',
          icon: <StockMarket />,
          children: [],
        },
        {
          id: '10',
          label: 'Cryptocurrency',
          icon: <CryptocurrnecyTitle />,
          children: [
            { id: '11', label: 'Fear and Greed', icon: <FearAndGreed /> },
            { id: '12', label: 'Altseason Index', icon: <AltSeasonIndex /> },
            { id: '13', label: 'BTC Dominance', icon: <BTCDominance /> },
            { id: '14', label: 'Cryptocurrency', icon: <Cryptocurrency /> },
          ],
        },
        { id: '15', label: 'Social Network', icon: <SocialNetwork />, children: [] },
        { id: '16', label: 'Marketplace', icon: <MarketPlace />, children: [] },
        { id: '17', label: 'Live Streaming', icon: <LiveStreaming />, children: [] },
        { id: '18', label: 'AI Assistant', icon: <AIAssistant />, children: [] },
        { id: '19', label: 'Portfolios', icon: <Portfolios />, children: [] },
        { id: '20', label: 'Calendar', icon: <Calendar />, children: [] },
        { id: '21', label: 'Terminal(DEMO)', icon: <Terminal />, children: [] },
      ],
    },
  ],
};

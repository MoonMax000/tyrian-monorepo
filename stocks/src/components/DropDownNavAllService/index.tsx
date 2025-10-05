import IconCMC from '@/assets/icons/icon-cmc.svg';
import IconTerminal from '@/assets/icons/icon-terminal.svg';
import IconSocWeb from '@/assets/icons/icon-socweb.svg';
import IconStreaming from '@/assets/icons/icon-stream.svg';
import IconAi from '@/assets/icons/icon-ai.svg';
import IconPortfolio from '@/assets/icons/portfolio.svg';
import IconMarcetplace from '@/assets/icons/marcetplace.svg';

import clsx from 'clsx';

const DropDownNavAllServiceData = [
  {
    name: 'CoinMarketCap',
    link: process.env.NEXT_PUBLIC_COINMARKETCAP_URL,
    icon: <IconCMC />,
  },
  {
    name: 'Торговый терминал',
    link: process.env.NEXT_PUBLIC_TRADING_TERMINAL_URL || '/',
    icon: <IconTerminal />,
  },
  {
    name: 'Соц. сеть',
    link: process.env.NEXT_PUBLIC_SOCIAL_NETWORK_URL,
    icon: <IconSocWeb />,
  },
  {
    name: 'Стриминг',
    link: process.env.NEXT_PUBLIC_STREAMING_URL,
    icon: <IconStreaming />,
  },
  {
    name: 'AI Помощник',
    link: process.env.NEXT_PUBLIC_AI_ASSISTANT_URL,
    icon: <IconAi />,
  },
  {
    name: 'Портфель',
    link: process.env.NEXT_PUBLIC_PORTFOLIO_URL,
    icon: <IconPortfolio />,
  },
  {
    name: 'Маркетплейс',
    link: process.env.NEXT_PUBLIC_MARKETPLACE_URL,
    icon: <IconMarcetplace />,
  },
];

const DropDownNavAllService = ({ className }: { className?: string }) => {
  return (
    <ul
      className={`w-[220px] bg-blackedGray shadow-[2px_8px_8px_#0000005C] rounded-lg z-50 ${className}`}
    >
      {DropDownNavAllServiceData.map((item, index) => {
        if (item.link === '/') {
          return (
            <li key={item.link} className='relative group'>
              <div className='flex gap-6 px-4 py-4text-body-15 bg-blackedGray opacity-50 cursor-not-allowed border-t border-white/10 select-none'>
                <span className='w-4 h-4'>{item.icon}</span>
                {item.name}
              </div>
            </li>
          );
        }

        return (
          <li key={item.link}>
            <a
              href={item.link}
              rel='noopener noreferrer'
              className={clsx(
                'flex gap-6 px-4 py-4 text-body-12 hover:bg-moonlessNight hover:rounded-lg border-t border-white/10',
                index === 0 && 'border-t-0',
                index === DropDownNavAllServiceData.length - 1 && 'border-b-0',
              )}
            >
              <span className='w-4 h-4'>{item.icon}</span>
              {item.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default DropDownNavAllService;

import Link from 'next/link';
import IconDiary from '@/assets/icons/icon-diary.svg';
import IconTerminal from '@/assets/icons/icon-terminal.svg';
import IconSocWeb from '@/assets/icons/icon-socweb.svg';
import IconStreaming from '@/assets/icons/icon-stream.svg';
import IconAi from '@/assets/icons/icon-ai.svg';
import IconPortfolio from '@/assets/icons/portfolio.svg';
import IconMarcetplace from '@/assets/icons/marcetplace.svg';
import clsx from 'clsx';

const DropDownNavData = [
  {
    name: 'Дневник трейдера',
    link: process.env.NEXT_PUBLIC_TRADER_DIARY_URL || '#',
    icon: <IconDiary />,
  },
  {
    name: 'Торговый терминал',
    link: process.env.NEXT_PUBLIC_TRADING_TERMINAL_URL || '#',
    icon: <IconTerminal />,
  },
  {
    name: 'Соц. сеть',
    link: process.env.NEXT_PUBLIC_SOCIAL_NETWORK_URL || '#',
    icon: <IconSocWeb />,
  },
  {
    name: 'Стриминг',
    link: process.env.NEXT_PUBLIC_STREAMING_URL || '#',
    icon: <IconStreaming />,
  },
  {
    name: 'AI Помощник',
    link: process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || '#',
    icon: <IconAi />,
  },
  {
    name: 'Портфель',
    link: process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#',
    icon: <IconPortfolio />,
  },
  {
    name: 'Маркетплейс',
    link: process.env.NEXT_PUBLIC_MARKETPLACE_URL || '#',
    icon: <IconMarcetplace />,
  },
];

const DropDownNav = ({ className }: { className?: string }) => {
  return (
    <ul className={`w-[220px] bg-[#181A20] shadow-[2px_8px_8px_#0000005C] rounded-lg ${className}`}>
      {DropDownNavData.map((item, index) => (
        <li key={item.link}>
          <a
            href={item.link}
            // target="_blank"
            rel='noopener noreferrer'
            className={clsx(
              'flex gap-6 px-4 py-4 text-[14px] leading-[19px] transition-opacity font-bold hover:bg-[#23252D] border-t border-white/10 first:border-t-0 last:border-b-0',
              {
                'cursor-not-allowed hover:bg-[#181A20] opacity-50': item.link === '#',
              },
            )}
          >
            <span className='w-4 h-4'>{item.icon}</span>
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DropDownNav;

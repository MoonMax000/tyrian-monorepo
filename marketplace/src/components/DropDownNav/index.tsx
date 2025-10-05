import clsx from 'clsx';
import Image from 'next/image';

const DropDownNavData = [
  {
    name: 'Дневник трейдера',
    link: process.env.NEXT_PUBLIC_TRADER_DIARY_URL || '#',
    icon: '/services-icons/icon-diary.svg',
  },
  {
    name: 'CoinMarketCap',
    icon: '/services-icons/icon-cmc.svg',
    link: process.env.NEXT_PUBLIC_COINMARKETCAP_URL || '#',
  },
  {
    name: 'Торговый терминал',
    link: '#',
    icon: '/services-icons/icon-terminal.svg',
  },
  {
    name: 'Соц. сеть',
    link: process.env.NEXT_PUBLIC_SOCIAL_NETWORK_URL || '#',
    icon: '/services-icons/icon-socweb.svg',
  },
  {
    name: 'Стриминг',
    link: process.env.NEXT_PUBLIC_STREAMING_URL || '#',
    icon: '/services-icons/icon-stream.svg',
  },
  {
    name: 'AI Помощник',
    link: process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || '#',
    icon: '/services-icons/icon-ai.svg',
  },
  {
    name: 'Портфель',
    link: process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#',
    icon: '/services-icons/portfolio.svg',
  },
];

const DropDownNav = ({ className }: { className?: string }) => {
  return (
    <ul
      className={`absolute w-[220px] bg-card shadow-[2px_8px_8px_#0000005C] rounded-[4px] border-[1px] border-[#FFFFFF14] ${className}`}
    >
      {DropDownNavData.map((item) => (
        <li key={item.link} className=' border-b-[1px] border-[#FFFFFF14] last:border-b-0'>
          <a
            href={item.link}
            rel='noopener noreferrer'
            className={clsx(
              'flex items-center gap-[10px] px-3 py-4 text-[16px] font-extralight hover:bg-moonlessNight',
              {
                'cursor-not-allowed hover:bg-blackedGray opacity-50': item.link === '#',
              },
            )}
          >
            <Image src={item.icon} alt='icon' width={24} height={24} />
            <span>{item.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default DropDownNav;

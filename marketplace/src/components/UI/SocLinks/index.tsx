import { FC } from 'react';

interface socLinkItem {
    name: string;
    link: string;
    icon: React.ReactNode;
}

interface SocLinksProps {
    networks: socLinkItem[];
}

const SocLinks: FC<SocLinksProps> = ({ networks }) => {
    return (
        <ul className='flex items-center gap-4 justify-center'>
            {networks.map((network) => (
                <li
                    key={network.name}
                    aria-label={network.name}
                    className='size-[48px] rounded-[50%]'
                >
                    <a
                        href={network.link}
                        target='_blank'
                        className='w-full h-full block [&>svg]:text-white [&>svg]:hover:text-purple'
                    >
                        {network.icon}
                    </a>
                </li>
            ))}
        </ul>
    );
};

export default SocLinks;
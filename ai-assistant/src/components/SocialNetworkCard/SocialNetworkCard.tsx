import Paper from '../ui/Paper/Paper';
import { FC, ReactNode } from 'react';
import Button from '../ui/Button/Button';
import ArrowButton from '@/assets/Navbar/ArrowButton.svg';
import MacroOutlook from '@/assets/mock-avatars/ActivityChatsMacroOutlook.jpg';
import SophiaLight from '@/assets/mock-avatars/SophiaLight.jpg';
import MarketChat from '@/assets/mock-avatars/ActivityChatsCryptoBasics.jpg';
import Image from 'next/image';
import { IndicatorTag } from '../ui/IndicatorTag/IndicatorTag';

const socialNetworkList = [
    { id: 2, img: SophiaLight, title: "Sophia Light", comment: "Check out new ETH Analysis..." },
    { id: 3, img: MarketChat, title: "Market Chat", comment: "3 new messages in the group" },
    { id: 1, img: MacroOutlook, title: "Macro Outlook 2025", comment: "17 new messages in the group" },
]

interface SocialNetworkCardProps {
    children?: ReactNode;
}

const SocialNetworkCard: FC<SocialNetworkCardProps> = ({ children }) => {
    return (
        <Paper className={'p-4 rounded-[24px] gap-[16px]'}>
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex flex-col justify-start overflow-hidden'>
                    <div className='flex justify-between'>
                        <div className='text-white font-bold text-[24px]'>Social Network</div>
                        <IndicatorTag type='purple' className='flex items-center text-[12px] font-bold py-[2px] px-[4px]'>12 new messages</IndicatorTag>
                    </div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex flex-col gap-[16px] mb-[16px]'>
                    {socialNetworkList.map(({id, img, title, comment}) => {
                        return (
                            <div key={id} className='flex items-center justify-start'>
                                <Image src={img} alt='Chat Photo' className='w-[44px] h-[44px] rounded-[50px] object-cover mr-2' priority />
                                <div className='flex flex-col'>
                                    <span className='text-lightPurple text-[15px] font-bold'>{title}</span>
                                    <span className='text-lighterAluminum text-[15px] font-[500]'>{comment}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px] mt-[16px]'> <ArrowButton className='w-[20px] h-[20px] rotate-[270deg]' /> Open Feed</Button>
            </div>
            {children}
        </Paper>
    );
};

export default SocialNetworkCard;
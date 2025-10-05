import { FC } from 'react';
import activityLivePic from '@/assets/mock-avatars/activityLivePic.jpg'
import Archived1 from '@/assets/mock-avatars/Archived1.jpg';
import Archived2 from '@/assets/mock-avatars/Archived2.jpg';
import ComingUpPic from '@/assets/mock-avatars/ComingUpPic.jpg';
import Image from 'next/image';


export const LiveStreamsTab: FC = () => {
    return (
        <>
            <div className='mb-2'>
                <span className='text-white text-[19px] font-bold'>Live Now</span>
                <div className='relative mt-2 rounded-lg overflow-hidden'>
                    <Image
                        src={activityLivePic}
                        alt='Live Stream'
                        className='w-[372px] h-[209px] rounded-lg object-cover'
                        priority
                    />
                    <span className='absolute top-2 left-2 bg-[#EF454A] text-white text-xs rounded px-2 py-0.5'>LIVE</span>
                    <span className='absolute bottom-2 left-2 bg-[#23252D] text-white text-xs rounded-[4px] px-2 py-0.5'>345 VIEWERS</span>
                </div>
                <div className='mt-2 mb-1 text-white text-[19px] font-bold'>
                    Investing in a new Solana solutions for the market
                </div>
                <div className='border-t border-regaliaPurple opacity-40'></div>
            </div>
            <div>
                <span className='text-white text-[19px] font-bold leading-none'>Coming Up</span>
                <div className='flex items-center mt-2'>
                    <Image src={ComingUpPic} alt='Coming Up' className='w-[84px] h-[44px] rounded-lg mr-2' priority />
                    <span className='text-white text-[15px] font-bold'>Profit Potential - Deep Dive!</span>
                </div>
            </div>
            <div className='border-t border-regaliaPurple opacity-40'></div>
            <div>
                <span className='text-white text-[19px] font-bold'>Archived</span>
                <div className='flex flex-col gap-[16px] mt-2'>
                    <div className='flex items-center'>
                        <Image src={Archived1} alt='Archived 1' className='w-[84px] h-[44px] rounded-lg mr-2 grayscale-0 opacity-50' priority />
                        <span className='text-lighterAluminum text-[15px] font-bold'>Instant Trades: Masterclass on Forex</span>
                    </div>
                    <div className='flex items-center'>
                        <Image src={Archived2} alt='Archived 2' className='w-[84px] h-[44px] rounded-lg mr-2 grayscale-0 opacity-50' priority />
                        <span className='text-lighterAluminum text-[15px] font-bold'>Bitcoin & Ethereum Market Analysis</span>
                    </div>
                </div>
            </div>
        </>
    );
}
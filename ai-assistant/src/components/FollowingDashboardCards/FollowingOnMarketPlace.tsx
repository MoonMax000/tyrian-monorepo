import Paper from '../ui/Paper/Paper';
import { FC } from 'react';
import Button from '../ui/Button/Button';
import Image from 'next/image';
import ProductsBTC from '@/assets/mock-avatars/ProductsBTC.png';
import ProductsMomentum from '@/assets/mock-avatars/ProductsMomentum.png';
import ProductsRiskMaster from '@/assets/mock-avatars/ProductsRiskMaster.png';
import PurchasesIcon from '@/assets/Dashboard/purchasesIcon.svg';
import { cn } from '@/utilts/cn';

const usersList = [
    { id: 1, img: ProductsRiskMaster, title: "RiskMaster - powerful tool for traders" },
    { id: 2, img: ProductsMomentum, title: "Momentum Brealout: Signals with 65% accuracy" },
    { id: 3, img: ProductsBTC, title: "BTC/USDT Grid-Bot HODL" },
    { id: 4, img: ProductsRiskMaster, title: "RiskMaster - powerful tool for traders" },
]

const FollowingOnMarketplaceCard: FC = () => {
    return (
        <Paper className={'p-4 rounded-[24px]'}>
            <div className='flex flex-col'>
                <div className='flex flex-col justify-start overflow-hidden'>
                    <div className='text-white font-bold text-[24px]'>Following on Marketplace</div>
                    <div className='border-t border-regaliaPurple opacity-40 my-2'></div>
                </div>
                <div className='flex flex-col gap-[9px] mt-[2px]'>
                    {usersList.map(({ id, img, title }, idx) => {
                        return (
                            <div key={id}>
                                <div className='flex items-center px-2 rounded-[12px] transition-colors duration-200 cursor-pointer hover:bg-regaliaPurple'>
                                    <Image src={img} alt='Product Photo' className='w-[122px] h-[64px] rounded-[8px] object-cover mr-2' priority />
                                    <span className='text-white text-[15px] font-bold'>{title}</span>
                                </div>
                                <div className={cn(
                                    {
                                        'border-b border-regaliaPurple mt-2 opacity-40': idx !== usersList.length - 1,
                                        '': idx === usersList.length - 1,
                                    })}>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Button className='text-white text-[15px] font-bold gap-[4px] px-[16px] mt-[12px]'> <PurchasesIcon className='w-[20px] h-[20px]' /> View Purchases</Button>
            </div>
        </Paper>
    );
};

export default FollowingOnMarketplaceCard;
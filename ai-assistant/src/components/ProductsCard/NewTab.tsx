import { FC } from 'react';
import Image from 'next/image';
import ProductsBTC from '@/assets/mock-avatars/ProductsBTC.png';
import ProductsMomentum from '@/assets/mock-avatars/ProductsMomentum.png';
import ProductsP2P from '@/assets/mock-avatars/ProductsP2P.png';
import ProductsRiskMaster from '@/assets/mock-avatars/ProductsRiskMaster.png';

const topSellersList = [
    { id: 1, img: ProductsRiskMaster, title: "RiskMaster - powerful tool for traders" },
    { id: 2, img: ProductsMomentum, title: "Momentum Brealout: Signals with 65% accuracy" },
    { id: 3, img: ProductsBTC, title: "BTC/USDT Grid-Bot HODL" },
    { id: 4, img: ProductsRiskMaster, title: "RiskMaster - powerful tool for traders" },
    { id: 5, img: ProductsP2P, title: "P2P Crypto Arbitrage from Scratch! Author’s training program." },
]

export const NewTab: FC = () => {
    return (
        <div className='flex flex-col gap-[12px]'>
            {topSellersList.map((topSeller, idx) => {
                return (
                    <div key={topSeller.id}>
                        <div className='flex items-center px-2 rounded-[12px] transition-colors duration-200 cursor-pointer hover:bg-regaliaPurple'>
                            <Image src={topSeller.img} alt='Product Photo' className='w-[84px] h-[44px] rounded-lg mr-2' priority />
                            <span className='text-white text-[15px] font-bold'>{topSeller.title}</span>
                        </div>
                        <div className={`${idx !== topSellersList.length - 1 ? 'border-b border-regaliaPurple mt-2 opacity-40' : ''}`}></div>
                    </div>
                )
            })}
        </div>
    )
}
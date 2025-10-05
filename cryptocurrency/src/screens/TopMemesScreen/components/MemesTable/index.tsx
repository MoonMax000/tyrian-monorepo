'use client';

import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';
import Image from 'next/image';

import IconDogecoin from '@/assets/coins/icon-xrp.png';
import IconInfoCircle from '@/assets/icons/info-circle.svg';
import SmallShortDiagram from '@/components/Diagrams/SmallShortDiagram';

const MemesCoinsTable = () => {
    const mockCoinsData = [
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },
        {
            number: 3,
            icon: IconDogecoin,
            name: 'Dogecoin',
            price: '35.83 ₽',
            change_1h: -0.70,
            change_24h: 2.25,
            change_7d: -4.59,
            market_cap: '5 293 193 934 268 ₽',
            volume_24h: '417 486 689 536 ₽',
            volume_btc: '11 625 643 962 DOGE',
            supply: '147 729 216 384 DOGE',
        },

    ];

    return (
        <Paper className='!px-0 py-0 !pb-0 w-full'>
            <div className='grid items-center grid-cols-[10px,130px,50px,50px,50px,50px,150px,150px,200px,1fr] px-6 py-4 bg-[#2A2C32] whitespace-nowrap gap-x-8'>
                <p className='opacity-40 text-titletable'>#</p>
                <p className='opacity-40 text-titletable'>НАЗВАНИЕ</p>
                <p className='opacity-40 text-titletable text-right'>ЦЕНА</p>
                <p className='opacity-40 text-titletable text-center'>% 1 Ч</p>
                <p className='opacity-40 text-titletable text-center'>% 24 Ч</p>
                <p className='opacity-40 text-titletable text-center'>% 7 ДН</p>
                <div className='flex items-center justify-end gap-2 opacity-40'>
                    <p className='text-titletable'>РЫН. КАП.</p>
                    <IconInfoCircle />
                </div>
                <div className='flex items-center justify-end gap-2 opacity-40'>
                    <p className='text-titletable'>ОБЪЕМ (24 Ч)</p>
                    <IconInfoCircle />
                </div>
                <div className='flex items-center gap-2 opacity-40'>
                    <p className='text-titletable'>ЦИРКУЛИР. ПРЕДЛОЖЕНИЕ</p>
                    <IconInfoCircle />
                </div>
                <p className='opacity-40 text-titletable'>ПОСЛЕДНИЕ 7 ДН</p>
            </div>

            <ul>
                {mockCoinsData.map((item, index) => (
                    <li key={index} className='grid items-center grid-cols-[10px,130px,50px,50px,50px,50px,150px,150px,200px,1fr] px-6 py-4 border-b border-[#FFFFFF14] hover:bg-[#272A32] gap-x-8'>
                        <span className='text-[15px]'>{item.number}</span>

                        <div className='flex items-center gap-2'>
                            <Image src={item.icon} alt={item.name} width={24} height={24} />
                            <span className='text-[15px] leading-5'>{item.name}</span>
                        </div>

                        <p className='text-right whitespace-nowrap'>{item.price}</p>

                        <div className='flex items-center justify-center'>
                            <ProcentLabel value={item.change_1h} symbolAfter='%' />
                        </div>

                        <div className='flex items-center justify-center'>
                            <ProcentLabel value={item.change_24h} symbolAfter='%' />
                        </div>

                        <div className='flex items-center justify-center'>
                            <ProcentLabel value={item.change_7d} symbolAfter='%' />
                        </div>

                        <p className='whitespace-nowrap'>{item.market_cap}</p>

                        <div className='flex flex-col items-end whitespace-nowrap'>
                            <span className='text-[15px] leading-5'>{item.volume_24h}</span>
                            <span className='text-[13px] leading-4 opacity-40'>{item.volume_btc}</span>
                        </div>

                        <p className='whitespace-nowrap text-end '>{item.supply}</p>

                        <SmallShortDiagram />
                    </li>
                ))}
            </ul>
        </Paper>
    );
};

export default MemesCoinsTable;

'use client';

import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import { formatCurrency } from '@/helpers/formatCurrency';
import clsx from 'clsx';
import Image from 'next/image';
import CustomArrow from '@/components/UI/SliderArrow';

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomArrow direction="right" onClick={() => {}} />,
  prevArrow: <CustomArrow direction="left" onClick={() => {}} />,
};

const mockData = [
  {
    name: 'COMP',
    profitability: -0.18,
    price: 17436.1,
    icon: '/countries/usa.svg',
  },
  {
    name: 'AMC',
    profitability: 0.67,
    price: 2.96,
    icon: '/countries/usa.svg',
  },
  {
    name: 'AMZN',
    profitability: 0.41,
    price: 197.4,
    icon: '/countries/usa.svg',
  },
  {
    name: 'COMP',
    profitability: -0.18,
    price: 17436.1,
    icon: '/countries/usa.svg',
  },
  {
    name: 'AMC',
    profitability: 0.67,
    price: 2.96,
    icon: '/countries/usa.svg',
  },
  {
    name: 'AMZN',
    profitability: 0.41,
    price: 197.4,
    icon: '/countries/usa.svg',
  },
];

const IndexesSlider = () => {
  return (
    <Slider {...settings} className='slider px-6 pt-8'>
      {mockData.map((item, index) => (
        <Paper
          key={index}
          className='!px-6 !flex flex-col justify-between gap-3 border-[2px] border-onyxGrey h-full'
        >
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6'>
              <Image
                width={24}
                height={24}
                src={item.icon}
                alt={item.name}
                className='rounded-full '
              />
            </div>

            <p className='text-body-12 font-semibold opacity-40 uppercase'>{item.name}</p>
          </div>

          <div className='flex items-center gap-2'>
            <p className='text-body-15'>
              {formatCurrency(item.price).replace(',', '.')}
            </p>
            <div
              className={clsx(
                'w-max py-[2px] px-1 rounded text-body-12 line-clamp-1',
                {
                  'bg-darkGreen text-green': item.profitability > 0,
                  'bg-darkRed text-red': item.profitability < 0,
                  'bg-[#aaa8a829]': item.profitability === 0,
                },
              )}
            >
              {item.profitability > 0 && '+'}
              {item.profitability.toFixed(2)}%
            </div>
          </div>
        </Paper>
      ))}
    </Slider>
  );
};

export default IndexesSlider;

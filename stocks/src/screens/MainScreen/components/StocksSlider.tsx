'use client';

import Paper from '@/components/Paper';
import React from 'react';
import Slider, { Settings } from 'react-slick';
import CustomArrow from '@/components/UI/SliderArrow';
import LinkDisplay from '@/components/UI/LinkDisplay';

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomArrow direction='right' onClick={() => { }} />,
  prevArrow: <CustomArrow direction='left' onClick={() => { }} />,
};

const mockStocks = [
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 230.58,
    profitability: 3.79,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 17436.1,
    profitability: -0.18,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 19376.96,
    profitability: -0.67,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 2901.27,
    profitability: -19.8,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 230.58,
    profitability: 3.79,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 17436.1,
    profitability: -0.18,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 19376.96,
    profitability: -0.67,
    href: '/',
  },
  {
    shortName: 'Nasdaq Index',
    icon: '/countries/usa.svg',
    price: 2901.27,
    profitability: -19.8,
    href: '/',
  },
];

const StocksSlider = () => {
  return (
    <Paper className='!py-8 !px-4 !pr-0 border-t border-onyxGrey rounded-t-none'>
      {/* <h4 className='text-h4'>Popular Among Investors</h4> */}

      <Slider {...settings} className='slider'>
        {mockStocks.map((item, index) => (
          <LinkDisplay linkItem={item} key={index} />
        ))}
      </Slider>
    </Paper>
  );
};

export default StocksSlider;

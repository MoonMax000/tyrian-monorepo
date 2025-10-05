'use client';

import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import './slider.css';
import Link from 'next/link';
import CustomArrow from '@/components/UI/SliderArrow';

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomArrow direction='right' onClick={() => { }} />,
  prevArrow: <CustomArrow direction='left' onClick={() => { }} />,
};

const mockNews = [
  {
    date: '25 DEC, 21:00',
    text: 'Far East Power Grid to Integrate with Wholesale Electricity Market Starting 25 January 2025',
  },
  {
    date: '25 DEC, 21:00',
    text: 'De Beers Fails to Sell $2B Diamond Stockpile - Financial Times',
  },
  {
    date: '25 DEC, 21:00',
    text: "Russia's 2025 GDP Growth Forecast at 2–2.5% – Novak",
  },
  {
    date: '25 DEC, 21:00',
    text: 'BRICS Nations to Account for Over 50% of Global GDP Within 15 Years',
  },
  {
    date: '25 DEC, 21:00',
    text: 'BRICS Nations to Account for Over 50% of Global GDP Within 15 Years',
  },
  {
    date: '25 DEC, 21:00',
    text: 'BRICS Nations to Account for Over 50% of Global GDP Within 15 Years',
  },
];

const NewsBlock = () => {
  return (
    <Paper className='!px-0'>
      <div className='flex items-center justify-between pl-4 pr-[22px]'>
        <h4 className='text-h4'>News feed</h4>
        <Link
          href='/market-news'
          className='text-body-15 hover:underline underline-offset-2 text-purple'
        >
          All News
        </Link>
      </div>

      <Slider {...settings} className='slider mt-6 pl-4'>
        {mockNews.map((item, index) => (
          <Paper
            key={index}
            className='!px-4 !flex flex-col !h-[184px] justify-between border-[2px] border-onyxGrey '
          >
            <p className='text-body-12 text-[#FFFFFF52] uppercase'>{item.date}</p>
            <p className='text-body-15'>{item.text}</p>
          </Paper>
        ))}
      </Slider>
    </Paper>
  );
};

export default NewsBlock;

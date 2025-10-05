'use client';

import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import CustomArrow from '@/components/UI/SliderArrow';

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomArrow direction='right' onClick={() => {}} />,
  prevArrow: <CustomArrow direction='left' onClick={() => {}} />,
};

const mockData = [
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
    shortName: 'SBER',
  },
];

const ReportingCalendarSlider = () => {
  return (
    <Paper className='!py-8 !px-6'>
      <div className='flex items-center justify-between'>
        <h4 className='text-h4'>Reporting Calendar</h4>
        <Link
          href='/market-news'
          className='text-body-15 text-purple flex items-center gap-[10px]'
        >
          View All
          <Image src='/arrow-circuled.svg' alt='arrow' width={5.52} height={7.06} />
        </Link>
      </div>

      <Slider {...settings} className='slider mt-6'>
        {mockData.map((item, index) => (
          <Paper
            key={index}
            className='!px-4 !flex flex-col justify-between gap-[32px] border-[2px] border-onyxGrey h-[198px] w-[289px]'
          >
            <div className='flex flex-col gap-4'>
              <p className='text-body-12 font-bold text-[#FFFFFF52]'>{item.date}</p>
              <div>
                <p className='text-body-15'>{item.text}</p>
                <p className='text-body-12 font-semibold opacity-48'>{item.shortName}</p>
              </div>
            </div>

            <div className='grid grid-cols-2 items-center gap-[20%]'>
              <div className='flex flex-col gap-2'>
                <p className='text-body-12 font-semibold opacity-48 uppercase'>Current</p>
                <p className='text-body-15'>—</p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-body-12 font-semibold opacity-48 uppercase'>Estimate</p>
                <p className='text-body-15'>$280.32</p>
              </div>
            </div>
          </Paper>
        ))}
      </Slider>
    </Paper>
  );
};

export default ReportingCalendarSlider;

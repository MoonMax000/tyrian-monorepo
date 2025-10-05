'use client';

import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import Link from 'next/link';
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
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
  },
  {
    date: '25 FEB',
    text: 'Sberbank PJSC - Common Shares',
  },
];

const EconomicSlider = () => {
  return (
    <Paper className='!py-8 !p-0'>
      <div className='flex items-center justify-between px-4'>
        <h4 className='text-h4'>Economic Calendar</h4>

        <Link href='/market-news' className='text-body-15 text-purple'>
          {'All Events >'}
        </Link>
      </div>

      <Slider {...settings} className='slider mt-6 pl-4'>
        {mockData.map((item, index) => (
          <Paper
            key={index}
            className='!-4 !flex flex-col justify-between gap-[48px] border-[2px] border-onyxGrey h-full'
          >
            <div className='flex flex-col gap-4'>
              <p className='text-body-12 text-[#FFFFFF52]'>{item.date}</p>
              <p className='text-body-15'>{item.text}</p>
            </div>

            <div className='grid grid-cols-2 items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-body-12 font-semibold opacity-48 uppercase'> current</p>
                <p className='text-body-15'>—</p>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-body-12 font-semibold opacity-48 uppercase'>estimate</p>
                <p className='text-body-15'>$280.32</p>
              </div>
            </div>
          </Paper>
        ))}
      </Slider>
    </Paper>
  );
};

export default EconomicSlider;

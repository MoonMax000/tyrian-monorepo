'use client';

import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import CustomArrow from '@/components/UI/SliderArrow';
import ChartDisplay from '@/components/UI/ChartDIsplay';

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
    name: 'GDP',
    price: '$2.02Т',
  },
  {
    name: 'Full-year GDP Growth',
    price: '$2.02Т',
  },
  {
    name: 'Real GDP',
    price: '$2.02Т',
  },
  {
    name: 'Key rate',
    price: '$2.02Т',
  },
];

const EconomicIndicatorsSlider = () => {
  return (
    <Paper className='!py-8 !px-6 !pr-0'>
      <Slider {...settings} className='slider mt-6'>
        {mockData.map((item, index) => (
          <ChartDisplay chartItem={item} key={index} />
        ))}
      </Slider>
    </Paper>
  );
};

export default EconomicIndicatorsSlider;

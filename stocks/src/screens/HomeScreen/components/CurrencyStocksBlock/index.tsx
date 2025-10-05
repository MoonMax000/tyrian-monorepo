import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import './slider.css';
import clsx from 'clsx';

import { formatCurrency } from '@/helpers/formatCurrency';
import CustomArrow from '@/components/UI/SliderArrow';
import PercentLabel from '@/components/UI/percentLabel';

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomArrow direction='right' onClick={() => {}} />,
  prevArrow: <CustomArrow direction='left' onClick={() => {}} />,
};

const mockStocks = [
  { name: 'HeadHunter', amount: 3400, percent: 0.0, shortName: 'HEAD' },
  { name: 'HeadHunter', amount: 3400, percent: 16.13, shortName: 'HEAD' },
  { name: 'HeadHunter', amount: 3400, percent: 20, shortName: 'HEAD' },
  { name: 'HeadHunter', amount: 3400, percent: 20, shortName: 'HEAD' },
  { name: 'HeadHunter', amount: 3400, percent: -2.5, shortName: 'HEAD' },
  { name: 'HeadHunter', amount: 3400, percent: -0.1, shortName: 'HEAD' },
];

const CurrencyStocksBlock = () => {
  return (
    <Paper>
      <h4 className='text-h4'>Popular Among Investors</h4>

      <Slider {...settings} className='slider mt-6'>
        {mockStocks.map((stock) => (
          <Paper
            key={stock.shortName}
            className='border border-moonlessNight hover:bg-moonlessNight !px-6 !flex flex-col gap-6'
          >
            <div className='flex items-center gap-2'>
              <p className='text-body-15'>{stock.name}</p>
              <p className='text-body-12 opacity-[48%] font-bold uppercase'>{stock.shortName}</p>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <p className='text-h4 font-bold'>{formatCurrency(stock.amount)}</p>

              <PercentLabel
                classes='!text-xs'
                value={Number(stock.percent.toFixed(2)) || 0}
                symbolAfter='%'
              />
            </div>
          </Paper>
        ))}
      </Slider>
    </Paper>
  );
};

export default CurrencyStocksBlock;

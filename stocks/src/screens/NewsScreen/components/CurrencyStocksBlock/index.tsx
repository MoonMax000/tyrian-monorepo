import Paper from '@/components/Paper';
import Slider, { Settings } from 'react-slick';
import './slider.css';
import clsx from 'clsx';
import IconChevronLeft from '@/assets/icons/chevron-left.svg';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { formatCurrency } from '@/helpers/formatCurrency';

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button type='button' className='absolute top-[50%] -right-8' onClick={onClick}>
      <IconChevronRight />
    </button>
  );
};

const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button type='button' className='absolute top-[50%] -left-8' onClick={onClick}>
      <IconChevronLeft />
    </button>
  );
};

const settings: Settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};

const mockStocks = [
  { name: 'Хэдхантер', amount: 3400, percent: 0.0, shortName: 'Head' },
  { name: 'Европлан', amount: 3400, percent: 16.13, shortName: 'Leas' },
  { name: 'Яковлев', amount: 3400, percent: 20, shortName: 'IRKT' },
  { name: 'СОЛЛЕРС', amount: 3400, percent: 20, shortName: 'SVAV' },
  { name: 'СОЛЛЕРС2', amount: 3400, percent: -2.5, shortName: 'SVAV2' },
  { name: 'СОЛЛЕРС3', amount: 3400, percent: -0.1, shortName: 'SVAV3' },
];

const CurrencyStocksBlock = () => {
  return (
    <>
      <h3 className='text-h4 pl-6'>Инвесторы также отслеживают</h3>

      <Slider {...settings} className='slider mt-6'>
        {mockStocks.map((stock) => (
          <Paper key={stock.shortName} className='!bg-blackedGray !px-6 !flex flex-col gap-6'>
            <div className='flex items-center gap-2'>
              <p className='text-body-15'>{stock.name}</p>
              <p className='text-body-12 opacity-[48%] font-bold uppercase'>{stock.shortName}</p>
            </div>
            <div className='flex items-center gap-3'>
              <p className='text-h4'>
                {formatCurrency(stock.amount, {
                  currency: 'RUB',
                  style: 'currency',
                  minimumFractionDigits: 2,
                }).replace(',', '.')}
              </p>
              <p className='py-[2px] px-1 rounded-[4px] bg-blackedGray'>
                <span
                  className={clsx('text-body-15', {
                    'text-green': stock.percent > 0,
                    'text-red': stock.percent < 0,
                    'text-white': stock.percent === 0,
                  })}
                >
                  {stock.percent.toFixed(2)}%
                </span>
              </p>
            </div>
          </Paper>
        ))}
      </Slider>
    </>
  );
};

export default CurrencyStocksBlock;

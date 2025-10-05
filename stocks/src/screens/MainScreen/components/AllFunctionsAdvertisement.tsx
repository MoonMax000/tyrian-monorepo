import IconCompany from '@/assets/icons/landing/company.svg';
import IconVisualization from '@/assets/icons/landing/visualization.svg';
import IconDividends from '@/assets/icons/landing/dividends.svg';
import IconAutoAnalyze from '@/assets/icons/landing/autoanalyze.svg';
import IconDots from '@/assets/icons/landing/dots.svg';
import IconNews from '@/assets/icons/landing/news.svg';

const list = [
  { name: '150+ Financial Ratios', icon: <IconDots /> },
  { name: '60,000+ Companies in Database', icon: <IconCompany /> },
  { name: '10–30 Years of Dividends', icon: <IconDividends /> },
  { name: 'Corporate Events', icon: <IconNews /> },
  { name: 'Fundamental Charts', icon: <IconVisualization /> },
  { name: 'Stock Ratings', icon: <IconAutoAnalyze /> },
];

const AllFunctionsAdvertisement = () => {
  return (
    <ul className='grid grid-cols-3 items-center gap-[48px] justify-between'>
      {list.map((item) => (
        <li key={item.name} className='flex items-center gap-4'>
          <div className='size-[48px] min-w-[48px] min-h-[48px] rounded-[50%] flex items-center justify-center bg-[#A06AFF7A] text-white'>
            {item.icon}
          </div>

          <p className='text-h4'>{item.name}</p>
        </li>
      ))}
    </ul>
  );
};

export default AllFunctionsAdvertisement;

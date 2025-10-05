import { FC, useState } from 'react';
import { cn } from '@/utilts/cn';
import Paper from '../ui/Paper/Paper';
import Button from '../ui/Button/Button';
import { NewTab } from './NewTab';
import { TopSellersTab } from './TopSellersTab';

interface ProductsCardProps {
  className?: string;
}
type TabType = 'new' | 'topSellers';

const ProductsCard: FC<ProductsCardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<TabType>('new');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'new':
        return <NewTab />;
      case 'topSellers':
        return <TopSellersTab />;
      default:
        return null;
    }
  };

  return (
    <Paper
      className={cn(
        className,
        'flex flex-col gap-3 p-4 rounded-[24px] border border-regaliaPurple backdrop-blur-[100px]',
      )}
    >
      <div className='flex justify-between items-center'>
        <span className='text-white text-[24px] font-bold'>Jane’s Products</span>
        <div className='text-[15px] font-bold text-lightPurple'>Show all &gt;</div>
      </div>
      <div className='border-t border-regaliaPurple opacity-40'></div>
      <div className='flex flex-start gap-[12px]'>
        <Button ghost={activeTab !== 'new'} onClick={() => setActiveTab('new')} className='w-[70px]'>
          New
        </Button>
        <Button ghost={activeTab !== 'topSellers'} onClick={() => setActiveTab('topSellers')}>
          Top Sellers
        </Button>
      </div>
      {renderTabContent()}
    </Paper>
  );
};

export default ProductsCard;

'use client';
import { FC, ReactNode, useEffect } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/UI/Tabs';
import Image from 'next/image';
import Button from '@/components/UI/Button/Button';
import TagLabel from '@/components/UI/TagLabel';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setActiveTab } from '@/store/slices/navSlice';
import { usePathname, useRouter } from 'next/navigation';
import { TabValues } from './types';
import BoxIcon from '@/assets/icons/box.svg';
import { FAQ } from '@/components/FAQ';
import All from '@/components/All';
import PlusIcon from '@/assets/icons/actions/plus.svg';

interface Props {
  children?: ReactNode;
  tabValue?: TabValues;
}

const MainScreen: FC<Props> = ({ children, tabValue }) => {
  const { activeTab } = useSelector((state: RootState) => state.nav);
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    push(`/${value}`);
    dispatch(setActiveTab(value as TabValues));
  };

  useEffect(() => {
    if (pathname.startsWith('/')) {
      const subpath = pathname.split('/')[1] as TabValues;

      if (Object.values(TabValues).includes(subpath)) {
        // Только диспатчим action, не делаем push, так как мы уже на нужной странице
        dispatch(setActiveTab(subpath as TabValues));
      }
    }
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between mb-[120px]'>
        <div>
          <h1 className='font-medium text-[56px]'>Marketplace</h1>

          <div className='text-[15px] font-medium flex gap-2 mt-8'>
            <p>Total Balance</p>
            <Image src='/icons/eye.svg' width={20} height={20} alt='' />
          </div>

          <p className='text-2xl font-medium mt-[6px]'>$1,000,000,000.00</p>

          <div className='flex gap-2 mt-4'>
            <p className='text-bold-15'>Today&apos;s PnL </p>
            <TagLabel value='+ $0.00' category='good' />
            <Image
              className='text-foreground fill-foreground'
              src='/icons/arrow.svg'
              width={24}
              height={24}
              alt=''
            />
          </div>

          <div className='flex gap-6 mt-[34px]'>
            <Button className='w-[180px] py-[3px] flex items-center gap-2 font-medium'>
              <BoxIcon width={16} height={16} />
              My Products
            </Button>
            <Button
              className='w-[180px] py-[3px] flex items-center gap-2 font-medium'
              onClick={() => push('/create-product')}
              ghost
            >
              <PlusIcon width={18} height={18} />
              Add Product
            </Button>
          </div>
        </div>

        <div className=' text-2xl font-semibold custom-bg-blur border-[1px] border-regaliaPurple grid place-items-center w-[344px] h-[194px] text-center text-webGray rounded-2xl'>
          <span>
            Advertising
            <br />
            Banner
          </span>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className='max-w-screen'>
        <TabsList className='flex flex-wrap border-b py-4 justify-between border-regaliaPurple !space-x-0'>
          <div className='flex flex-wrap gap-x-3 gap-y-3w-full max-w-full'>
            <TabsTrigger value={TabValues.All} className='!font-medium mb-3 h-[32px]'>
              All
            </TabsTrigger>
            <TabsTrigger value={TabValues.Popular} className='!font-medium mb-3 h-[32px]'>
              Popular
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Favorites}
              className='!font-medium mb-1 text-nowrap h-[32px] '
            >
              Favorites
            </TabsTrigger>

            <TabsTrigger
              value={TabValues.Signals}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Signals and Technical indicators
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Strategies}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Strategies and Portfolios
            </TabsTrigger>

            <TabsTrigger
              value={TabValues.Robots}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Trading robots and Algorithms
            </TabsTrigger>
          </div>
          <div className='flex flex-wrap gap-x-3 w-full max-w-full'>
            <TabsTrigger
              value={TabValues.Consultants}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Investment consultants
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Analystys}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Analysts
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Traders}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Traders
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Script}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Scripts and Software
            </TabsTrigger>

            <TabsTrigger
              value={TabValues.Courses}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Courses and Training materials
            </TabsTrigger>
            <TabsTrigger
              value={TabValues.Others}
              className='!font-medium mb-3  text-nowrap h-[32px] '
            >
              Others
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value={tabValue ?? TabValues.All}>{children ?? <All />}</TabsContent>
      </Tabs>

      <section className='mb-60'>
        <FAQ />
      </section>
    </div>
  );
};

export default MainScreen;

'use client';
import SocialNetworks from './components/SocialNetworks';
import FaqBlock from './components/FaqBlock';
import Container from '@/components/UI/Container';
import Paper from '@/components/Paper';
import ButtonTag from './components/ButtonTag';
import SearchInput from '@/components/SearchInput';
import IconFilter from '@/assets/icons/icon-filter.svg';
import Button from '@/components/UI/Button';
import IconGrid from '@/assets/icons/icon-grid.svg';
import IconList from '@/assets/icons/icon-list.svg';
import CalendarTable from './components/CalendarTable';

const DividendCalendarScreen = () => {
  return (
    <>
      <Container>
        <h3 className='pt-4 mb-12 text-[56px] font-bold'>Events Calendar</h3>
        <Paper className='!p-0 rounded-3xl border border-regaliaPurple bg-transparent backdrop-blur-[100px]'>
          <div className='px-6 pt-6 pb-4 flex items-center border-b border-regaliaPurple'>
            <div className='w-full flex items-center gap-2'>
              <ButtonTag text={'Financial Results'} color={'#6AA6FF'} />
              <ButtonTag text={'Operating Results'} color={'#FFB46A'} />
              <ButtonTag text={'Dividends'} color={'#A06AFF'} />
              <ButtonTag text={'Board of Directors'} color={'#6AFF9C'} />
              <ButtonTag text={'Shareholder Meeting'} color={'#FF6A79'} />
              <ButtonTag text={'Other'} color={'#D9D9D9'} />
              <ButtonTag text={'All'} color={'#D9D9D9'} noneBg={true} />
            </div>
          </div>
          <div className='px-6 pt-4 pb-6 flex items-center justify-between'>
            <div className='flex items-start gap-4'>
              <SearchInput
                placeholder='Company Search'
                className='min-w-[360px] !h-10'
                inputWrapperClassName='!bg-transparent border-regaliaPurple'
              />
              <Button
                icon={<IconFilter />}
                className='px-[14px] py-2 !text-webGray border border-regaliaPurple'
                variant='transparent'
              >
                Filters
              </Button>
            </div>
            <div className='flex items-center gap-2'>
              <div className='bg-gradient-to-l from-[#482090] to-[#A06AFF] px-3 py-[6px] rounded-[8px] '>
                <IconGrid />
              </div>
              <div className='bg-moonlessNight px-3 py-[6px] rounded-[8px]'>
                <IconList />
              </div>
            </div>
          </div>
        </Paper>

        <Paper className='!p-0 !mt-6 border border-regaliaPurple rounded-3xl bg-transparent backdrop-blur-[100px]'>
          <CalendarTable />
        </Paper>
      </Container>

      <section className='my-[88px]'>
        <SocialNetworks />
      </section>

      <Container as='section' className='mb-[132px]'>
        <FaqBlock />
      </Container>
    </>
  );
};

export default DividendCalendarScreen;

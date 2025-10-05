'use client';
import Container from '@/components/UI/Container';
import Select from '@/components/UI/Select';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/UI/Pagination';
import Image from 'next/image';

const NewsScreen = () => {
  const NEWS_MOCK = [
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219.svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (1).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (2).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (3).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (4).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (5).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (6).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (7).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (8).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
    {
      title:
        'The Ministry of Justice has registered an order to establish a standard for sales of petrochemicals on the stock exchange',
      icon: '/mock/news/Rectangle 8219 (9).svg',
      text: 'Goldman Sachs earnings beat Q1 views as global banking revenue offset declines elsewhere. The Dow giant was cautious on Q2. But GS stock rose.',
      tag: 'Business DailY',
      date: 'Dec 26, 2024, 22:40',
    },
  ];

  return (
    <Container className='mb-32'>
      <div className='flex justify-between items-center my-4'>
        <div className='flex gap-4 items-center w-[50%] my-4'>
          <h2 className=' text-[31px] w-fit'>News Feed</h2>
          <Select
            variant='transparent'
            placeholder='All countries'
            wrapperClassName='!w-[140px]'
            className='!w-[140px]'
          />
          <Select
            variant='transparent'
            placeholder='All Exchanges'
            wrapperClassName='!w-[150px]'
            className='!w-[150px]'
          />
        </div>
        <SearchInput
          className='!w-[356px] '
          inputWrapperClassName='!bg-transparent'
          placeholder='News Search'
        />
      </div>

      <div className='flex flex-col gap-6'>
        {NEWS_MOCK.map((el, index) => {
          return (
            <div
              className='flex items-center justify-between pb-[22px] border-b my-3 border-onyxGrey'
              key={index}
            >
              <div className='max-w-[724px]'>
                <p className='text-2xl font-bold mb-2'>{el.title}</p>
                <p className='text-[15px] font-medium mb-3'>{el.title}</p>
                <div className='flex gap-[6px] text-xs opacity-48 font-bold uppercase'>
                  <span>{el.tag}</span>
                  <p>•</p>
                  <span>{el.date}</span>
                </div>
              </div>
              <Image className='rounded-lg' width={248} height={140} alt='' src={el.icon} />
            </div>
          );
        })}
      </div>

      <div className='w-full flex justify-center mt-12'>
        <Pagination currentPage={1} totalPages={3} onChange={() => {}} />
      </div>
    </Container>
  );
};

export default NewsScreen;

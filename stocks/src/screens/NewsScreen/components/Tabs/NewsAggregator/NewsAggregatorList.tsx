import Paper from '@/components/Paper';
import { StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';
import IconFlag from '@/assets/icons/icon-flag.svg';
import IconFlagFull from '@/assets/icons/icon-flag-full.svg';
import { useState } from 'react';
import CreateNoteModal from '@/components/Layout/CreateNoteModal';

const NewsAggregatorList = () => {
  const [clickedIcons, setClickedIcons] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['GetNews'],
    queryFn: () =>
      StocksService.news().then((response) =>
        response.data.map((item, index) => ({
          id: index + 1,
          date: new Date(item.published_at).toLocaleDateString(),
          title: item.title,
        })),
      ),
  });

  if (isLoading) {
    return <p>Загрузка новостей...</p>;
  }

  if (isError) {
    return <p className='text-red-500'>Ошибка загрузки новостей.</p>;
  }

  return (
    <Paper className='!p-0'>
      <ul>
        {data?.map((data, index) => (
          <li
            key={index}
            className='grid grid-cols-[17.5%,auto,auto] items-center gap-4 px-6 py-4 h-[68px]'
          >
            <p className='text-body-15 opacity-[48%]'>{data.date}</p>
            <p className='text-body-15'>{data.title}</p>
            <div
              className='justify-self-end cursor-pointer'
              onClick={() => {
                setClickedIcons((prev) => ({ ...prev, [index]: !prev[index] })); 
                setIsModalOpen(true);
              }}
            >
              {clickedIcons[index] ? (
                <IconFlagFull />
              ) : (
                <IconFlag className='text-[#FFFFFF28] hover:text-purple opacity-100 cursor-pointer' />
              )}
            </div>
          </li>
        ))}
      </ul>
        <CreateNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Paper>
  );
};

export default NewsAggregatorList;

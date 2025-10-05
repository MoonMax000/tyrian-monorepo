import Paper from '@/components/Paper';
import Link from 'next/link';

const headings = [
  { name: 'ДАТА', key: 'date' },
  { name: 'ТИП СОБЫТИЯ', key: 'type' },
  { name: 'ОПИСАНИЕ', key: 'description' },
] as const;

type Keys = (typeof headings)[number]['key'];

const mockData: Record<Keys, string>[] = [
  {
    date: '31.10.2024',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 4 кв. 2024 г.',
  },
  {
    date: '02.05.2024',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 3 кв. 2024 г.',
  },
  {
    date: '28.02.2024',
    type: 'Собрание акционеров',
    description: 'Годовое общее собрание акционеров',
  },
  {
    date: '05.02.2024',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 2 кв. 2024 г.',
  },
  {
    date: '01.02.2024',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 1 кв. 2024 г.',
  },
  {
    date: '02.11.2023',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 4 кв. 2023 г.',
  },
  {
    date: '03.08.2023',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 3 кв. 2023 г.',
  },
  {
    date: '04.05.2023',
    type: 'Финансовые результаты',
    description: 'Финансовые результаты за 2 кв. 2023 г.',
  },
];

const FutureEvents = () => {
  return (
    <Paper className='!px-0'>
      <div className='flex items-center justify-between px-6'>
        <h3 className='text-h4'>Предстоящие события</h3>
        <Link href='' className='text-body-15 underline underline-offset-2 text-purple'>
          {'События всех компаний >'}
        </Link>
      </div>

      <ul className='mt-4 bg-moonlessNight px-6 py-4 grid grid-cols-[15%,20%,auto] items-center gap-4'>
        {headings.map((heading) => (
          <li key={heading.key} className='text-h3table opacity-[48%] text-left'>
            {heading.name}
          </li>
        ))}
      </ul>

      <ul>
        {mockData.map((data, index) => (
          <li
            key={index}
            className='grid grid-cols-[15%,20%,auto] items-center gap-4 px-6 py-4 border-b border-gray-700 h-[68px]'
          >
            {headings.map((head) => (
              <p key={head.key} className='text-body-15 text-left'>
                {data[head.key]}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default FutureEvents;

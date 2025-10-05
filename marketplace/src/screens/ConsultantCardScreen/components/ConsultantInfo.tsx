import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import List from '@/components/UI/List';

import CheckIcon from '@/assets/icons/icon-check.svg';

interface IConsultantInfoProps {
  about: string;
  cases: string[];
  services: string[];
  educations: string[];
  personal: string[];
}

export const ConsultantInfo: FC<IConsultantInfoProps> = ({
  about,
  cases,
  services,
  educations,
  personal,
}) => {
  const consultantInfoList = [
    {
      title: 'About me:',
      content: <p className='text-[15px] font-medium'>{about}</p>,
    },
    {
      title: 'Results and Cases:',
      content: <List list={cases} Icon={CheckIcon} />,
    },
    {
      title: 'Services:',
      content: <List list={services} />,
    },
    {
      title: 'Education and Certifications:',
      content: <List list={educations} />,
    },
    {
      title: 'Personal:',
      content: <List list={personal} />,
    },
  ];

  return (
    <Paper className='p-4 flex flex-col gap-y-4'>
      {consultantInfoList.map(({ title, content }) => (
        <div key={title}>
          <h3 className='text-purple text-[19px] font-bold mb-4'>{title}</h3>
          {content}
        </div>
      ))}
    </Paper>
  );
};

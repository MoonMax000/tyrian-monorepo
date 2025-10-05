import type { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';
import AttributeCard from '@/components/UI/AttributeCard';
import { sberAttributes } from '../constants';

export const AboutSberModal: FC = () => {
  return (
    <ContentWrapper className='p-4 flex flex-col gap-y-6'>
      <AttributeCard title='About Sberbank' items={[]} className='p-4' />
      <AttributeCard
        title='About Sberbank'
        items={sberAttributes}
        className='p-4 mt-6'
        bottomContent={
          <p className='text-[15px] text-grayLight font-medium inline-block max-w-[720px]'>
            Sberbank Russia PJSC provides commercial banking and financial services. The company
            engages in corporate and retail banking activities, such as corporate loans, asset
            management, payroll projects, leasing, online banking, cash and settlement services,
            among others. In addition, the company offers a wide range of services to financial
            institutions, such as correspondent accounts, custody services, and interbank lending,
            among others. It operates through the following segments: Moscow, Central and Northern
            Regions of European Part of Russia; Volga Region and South of European Part of Russia;
            Ural, Siberia and Far East of Russia; and Other Countries. The company was founded in
            1841 and is headquartered in Moscow, Russia.
          </p>
        }
      />
    </ContentWrapper>
  );
};

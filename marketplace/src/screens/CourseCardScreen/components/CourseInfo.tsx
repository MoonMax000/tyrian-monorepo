import type { FC } from 'react';

import Paper from '@/components/UI/Paper';
import List from '@/components/UI/List';
import Expandable from '@/components/UI/Expandable';

import CheckIcon from '@/assets/icons/icon-check.svg';

const leftList = [
  'What is blockchain and how it works',
  'Basics of P2P trading',
  'Risk management',
  'Trading Automation',
];

const rightList = [
  'Working with wallets and exchanges',
  'Arbitrage strategies',
  'Tax aspects of cryptocurrencies',
  'Business scaling',
];

const bottomList = [
  'Basic knowledge of cryptocurreincies',
  'Computer with interner access',
  'Willingness to learn and grow in crypto trading',
];

export const CourseInfo: FC = () => (
  <Paper className='p-4'>
    <div className='pb-4 border-b-[1px] border-gunpowder'>
      <h3 className='text-[19px] font-bold text-purple'>What you will learn</h3>
      <Expandable collapsedHeight={131} className='mt-4'>
        <div className='grid grid-cols-2 gap-4'>
          <List list={leftList} Icon={CheckIcon} />
          <List list={rightList} Icon={CheckIcon} />
          <List list={leftList} Icon={CheckIcon} />
          <List list={rightList} Icon={CheckIcon} />
        </div>
      </Expandable>
    </div>
    <div className='mt-4'>
      <h3 className='text-[19px] font-bold text-purple'>Requirements</h3>
      <List list={bottomList} Icon={CheckIcon} className='mt-4' />
    </div>
  </Paper>
);

'use client';

import Paper from '@/components/Paper';
import Diagram from './constants/diagram.svg';
import Table from './constants/table.svg';

const Finance = () => {
  return (
    <section className='flex flex-col gap-6'>
      <Paper className='!p-0 mt-7'>
        <Diagram />
      </Paper>
      <Paper className='!p-0 mt-12'>
        <Table />
      </Paper>
    </section>
  );
};

export default Finance;

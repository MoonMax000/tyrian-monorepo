'use client';

import Paper from '@/components/Paper';
import CalendarTable from '@/screens/EventsCalendarScreen/components/CalendarTable';
const Events = () => {
  return (
    <section className='flex flex-col gap-6'>
      <Paper className='!p-0 mt-7'>
        <CalendarTable/>
      </Paper>
    </section>
  );
};

export default Events;
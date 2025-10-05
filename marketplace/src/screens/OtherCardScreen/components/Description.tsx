import type { FC } from 'react';

import DescriptionCard from '@/components/UI/DescriptionCard';
import List from '@/components/UI/List';

const list = [
  'Task Scheduling: Set tasks to run daily, weekly. or at custom intervals.',
  'Error Handling: Automatically logs errors and retries failed tasks.',
  'Notifications: Send alerts via Telegram upon task completion or failure.',
];

export const Description: FC = () => (
  <DescriptionCard title='Description'>
    <div className='flex flex-col gap-y-4 text-[15px] font-medium'>
      <span>New Feature: Scheduled Task Automation</span>
      <p>
        This functionality allows the script to automatically execute predefined tasks at set
        intervals or specific times, ensuring seamless operation without manual intervention.
      </p>
      <div>
        <span>Key Capabilities:</span>
        <List list={list} className='mt-4' />
      </div>
    </div>
  </DescriptionCard>
);

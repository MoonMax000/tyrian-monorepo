'use client';

import { useState, type FC } from 'react';

import Paper from '@/components/UI/Paper';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/UI/Tabs';

const topTabs = [
  { label: 'Statistics', value: 'statistics' },
  { label: 'Trades', value: 'trades' },
];

const bottomTabs = [
  { label: 'All', value: 'all' },
  { label: 'Trades', value: 'trades' },
  { label: 'Bots', value: 'bots' },
];

export const AnalystTabs: FC = () => {
  const [activeTopTab, setActiveTopTab] = useState(topTabs[0].value);

  const [activeBottomTab, setActiveBottomTab] = useState(bottomTabs[0].value);

  return (
    <Paper className='px-4 py-3'>
      <Tabs value={activeTopTab} onValueChange={setActiveTopTab}>
        <TabsList>
          {topTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} variant='outlined'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='mt-4'>
          {topTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Tabs value={activeBottomTab} onValueChange={setActiveBottomTab}>
                <TabsList withUnderLine={false}>
                  {bottomTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className='min-w-40 max-h-[26px]'
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </Paper>
  );
};

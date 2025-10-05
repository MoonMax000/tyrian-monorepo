'use client';

import { Provider } from 'react-redux';
import store from '@/store/store';

export const RTKQueryWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

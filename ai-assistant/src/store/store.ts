import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import rootReducer from './reducers/root';

const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
  } as ConfigureStoreOptions);
  return store;
};

export const store = makeStore();

export type AppStore = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });

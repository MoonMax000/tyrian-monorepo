import { TabValues } from '@/screens/MainScreen/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavState {
  activeTab: TabValues;
}

const initialState: NavState = {
  activeTab: TabValues.All,
};

const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<TabValues>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = navSlice.actions;
export default navSlice.reducer;

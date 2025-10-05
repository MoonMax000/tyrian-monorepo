import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
  subscribedUserIds: string[];
}

const initialState: SubscriptionState = {
  subscribedUserIds: [],
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    subscribe: (state, action: PayloadAction<string>) => {
      if (!state.subscribedUserIds.includes(action.payload)) {
        state.subscribedUserIds.push(action.payload);
      }
    },
    unsubscribe: (state, action: PayloadAction<string>) => {
      state.subscribedUserIds = state.subscribedUserIds.filter((id) => id !== action.payload);
    },
  },
});

export const { subscribe, unsubscribe } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;

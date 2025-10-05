import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  username?: string;
  email?: string | null;
  email_confirmed?: boolean;
  description?: string;
  avatar_url?: string;
  cover_url?: string;
  donation_url?: string;
  roles?: string[] | null;
  permits?: string[] | null;
  notification_settings?: unknown | null;
}

const initialState: UserState = {
  id: null,
  username: undefined,
  email: null,
  email_confirmed: undefined,
  description: undefined,
  avatar_url: undefined,
  cover_url: undefined,
  donation_url: undefined,
  roles: null,
  permits: null,
  notification_settings: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUserData: () => {
      return initialState;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;

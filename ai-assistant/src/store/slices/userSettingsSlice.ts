import { TSelectedMethod } from '@/components/modals/TwoFactorAuth/TwoFactorModalCard';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  email: string;
  phone: string;
  recoveryEmail: string;
  recoveryPhone: string;
  selectedMethod: TSelectedMethod;
}

const initialState: UserSettingsState = {
  email: 'example@gmail.com',
  phone: '+79378835517',
  recoveryEmail: '',
  recoveryPhone: '',
  selectedMethod: 'email',
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    changeEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    changePhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    changeRecoveryEmail: (state, action: PayloadAction<string>) => {
      state.recoveryEmail = action.payload;
    },
    changeRecoveryPhone: (state, action: PayloadAction<string>) => {
      state.recoveryPhone = action.payload;
    },
    changeSelectedMethod: (state, action: PayloadAction<TSelectedMethod>) => {
      state.selectedMethod = action.payload;
    },
    setAllUserSettings: (state, action: PayloadAction<UserSettingsState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  changeEmail,
  changePhone,
  changeRecoveryEmail,
  changeRecoveryPhone,
  changeSelectedMethod,
  setAllUserSettings,
} = userSettingsSlice.actions;

export default userSettingsSlice.reducer;

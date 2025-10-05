import { combineReducers } from '@reduxjs/toolkit';
import userSettingsReducer from '../slices/userSettingsSlice';

const rootReducer = combineReducers({
  settings: userSettingsReducer,
});

export default rootReducer;

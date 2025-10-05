import { SearchFilter } from '@/components/Header/components/SearchBar/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchString: string;
  searchCategory: SearchFilter;
}

const initialState: SearchState = {
  searchString: '',
  searchCategory: 'ideas',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchString(state, action: PayloadAction<string>) {
      state.searchString = action.payload;
    },
    setSearchCategory(state, action: PayloadAction<SearchFilter>) {
      state.searchCategory = action.payload;
    },
    setSearchParams(state, action: PayloadAction<SearchState>) {
      state.searchString = action.payload.searchString;
      state.searchCategory = action.payload.searchCategory;
    },
  },
});

export const { setSearchString, setSearchCategory, setSearchParams } = searchSlice.actions;
export default searchSlice.reducer;

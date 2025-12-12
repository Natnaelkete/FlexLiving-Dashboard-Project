import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  listingId?: string;
  type?: string;
  status?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
  channel?: string;
  selectedForPublic?: string; // 'true' | 'false'
}

const initialState: FiltersState = {};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FiltersState>) => {
      return { ...state, ...action.payload };
    },
    clearFilters: () => initialState,
  },
});

export const { setFilters, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedTag: string;
  sortBy: string;
}

const initialState: FilterState = {
  searchTerm: "",
  selectedCategory: "All",
  selectedTag: "All",
  sortBy: "popularity", // default sort option
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSelectedTag,
  setSortBy,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

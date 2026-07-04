import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  depenses: [],
  categories: [],
  loading: false,
  error: null,
};

const depensesSlice = createSlice({
  name: 'depenses',
  initialState,
  reducers: {
    setDepenses: (state, action) => {
      state.depenses = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addDepense: (state, action) => {
      state.depenses.push(action.payload);
    },
    updateDepense: (state, action) => {
      const index = state.depenses.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.depenses[index] = action.payload;
      }
    },
    deleteDepense: (state, action) => {
      state.depenses = state.depenses.filter(d => d.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDepenses,
  setCategories,
  addDepense,
  updateDepense,
  deleteDepense,
  clearError,
} = depensesSlice.actions;

export default depensesSlice.reducer;

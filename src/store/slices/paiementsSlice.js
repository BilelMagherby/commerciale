import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paiements: [],
  loading: false,
  error: null,
};

const paiementsSlice = createSlice({
  name: 'paiements',
  initialState,
  reducers: {
    setPaiements: (state, action) => {
      state.paiements = action.payload;
    },
    addPaiement: (state, action) => {
      state.paiements.push(action.payload);
    },
    updatePaiement: (state, action) => {
      const index = state.paiements.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.paiements[index] = action.payload;
      }
    },
    deletePaiement: (state, action) => {
      state.paiements = state.paiements.filter(p => p.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPaiements,
  addPaiement,
  updatePaiement,
  deletePaiement,
  clearError,
} = paiementsSlice.actions;

export default paiementsSlice.reducer;

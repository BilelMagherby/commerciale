import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fournisseurs: [],
  loading: false,
  error: null,
};

const fournisseursSlice = createSlice({
  name: 'fournisseurs',
  initialState,
  reducers: {
    setFournisseurs: (state, action) => {
      state.fournisseurs = action.payload;
    },
    addFournisseur: (state, action) => {
      state.fournisseurs.push(action.payload);
    },
    updateFournisseur: (state, action) => {
      const index = state.fournisseurs.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fournisseurs[index] = action.payload;
      }
    },
    deleteFournisseur: (state, action) => {
      state.fournisseurs = state.fournisseurs.filter(f => f.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFournisseurs,
  addFournisseur,
  updateFournisseur,
  deleteFournisseur,
  clearError,
} = fournisseursSlice.actions;

export default fournisseursSlice.reducer;

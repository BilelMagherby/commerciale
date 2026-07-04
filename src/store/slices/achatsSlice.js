import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  achats: [],
  bonsCommande: [],
  facturesAchat: [],
  loading: false,
  error: null,
};

const achatsSlice = createSlice({
  name: 'achats',
  initialState,
  reducers: {
    setAchats: (state, action) => {
      state.achats = action.payload;
    },
    setBonsCommande: (state, action) => {
      state.bonsCommande = action.payload;
    },
    setFacturesAchat: (state, action) => {
      state.facturesAchat = action.payload;
    },
    addAchat: (state, action) => {
      state.achats.push(action.payload);
    },
    addBonCommande: (state, action) => {
      state.bonsCommande.push(action.payload);
    },
    addFactureAchat: (state, action) => {
      state.facturesAchat.push(action.payload);
    },
    updateAchat: (state, action) => {
      const index = state.achats.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.achats[index] = action.payload;
      }
    },
    deleteAchat: (state, action) => {
      state.achats = state.achats.filter(a => a.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAchats,
  setBonsCommande,
  setFacturesAchat,
  addAchat,
  addBonCommande,
  addFactureAchat,
  updateAchat,
  deleteAchat,
  clearError,
} = achatsSlice.actions;

export default achatsSlice.reducer;

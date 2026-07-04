import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  societe: {
    nom: "Marbre & Pierre",
    logo: "🏛️",
    adresse: "123 Rue du Commerce, Tunis",
    telephone: "+216 71 123 456",
    email: "contact@marbre-pierre.tn",
    matriculeFiscal: "1234567/A/M/000",
    registreCommerce: "B1234567890",
  },
  settings: {
    devise: "EUR",
    langue: "fr",
    theme: "light",
  },
  loading: false,
  error: null,
};

const parametresSlice = createSlice({
  name: 'parametres',
  initialState,
  reducers: {
    setSociete: (state, action) => {
      state.societe = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    updateSociete: (state, action) => {
      state.societe = { ...state.societe, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSociete,
  setSettings,
  updateSociete,
  clearError,
} = parametresSlice.actions;

export default parametresSlice.reducer;

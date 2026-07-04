import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  ventes: [],
  devis: [],
  loading: false,
  error: null,
};

// Async thunks for API calls (placeholder for future API integration)
export const fetchVentes = createAsyncThunk(
  'ventes/fetchVentes',
  async () => {
    // Replace with actual API call
    return [];
  }
);

export const addVente = createAsyncThunk(
  'ventes/addVente',
  async (venteData) => {
    // Replace with actual API call
    return venteData;
  }
);

export const updateVente = createAsyncThunk(
  'ventes/updateVente',
  async ({ id, venteData }) => {
    // Replace with actual API call
    return { id, ...venteData };
  }
);

export const deleteVente = createAsyncThunk(
  'ventes/deleteVente',
  async (id) => {
    // Replace with actual API call
    return id;
  }
);

const ventesSlice = createSlice({
  name: 'ventes',
  initialState,
  reducers: {
    setVentes: (state, action) => {
      state.ventes = action.payload;
    },
    setDevis: (state, action) => {
      state.devis = action.payload;
    },
    addVenteLocal: (state, action) => {
      state.ventes.push(action.payload);
    },
    addDevisLocal: (state, action) => {
      state.devis.push(action.payload);
    },
    updateVenteLocal: (state, action) => {
      const index = state.ventes.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.ventes[index] = action.payload;
      }
    },
    deleteVenteLocal: (state, action) => {
      state.ventes = state.ventes.filter(v => v.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVentes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVentes.fulfilled, (state, action) => {
        state.loading = false;
        state.ventes = action.payload;
      })
      .addCase(fetchVentes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addVente.fulfilled, (state, action) => {
        state.ventes.push(action.payload);
      })
      .addCase(updateVente.fulfilled, (state, action) => {
        const index = state.ventes.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.ventes[index] = action.payload;
        }
      })
      .addCase(deleteVente.fulfilled, (state, action) => {
        state.ventes = state.ventes.filter(v => v.id !== action.payload);
      });
  },
});

export const {
  setVentes,
  setDevis,
  addVenteLocal,
  addDevisLocal,
  updateVenteLocal,
  deleteVenteLocal,
  clearError,
} = ventesSlice.actions;

export default ventesSlice.reducer;

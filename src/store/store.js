import { configureStore } from '@reduxjs/toolkit';
import ventesReducer from './slices/ventesSlice';
import achatsReducer from './slices/achatsSlice';
import clientsReducer from './slices/clientsSlice';
import fournisseursReducer from './slices/fournisseursSlice';
import rhReducer from './slices/rhSlice';
import paiementsReducer from './slices/paiementsSlice';
import depensesReducer from './slices/depensesSlice';
import parametresReducer from './slices/parametresSlice';

export const store = configureStore({
  reducer: {
    ventes: ventesReducer,
    achats: achatsReducer,
    clients: clientsReducer,
    fournisseurs: fournisseursReducer,
    rh: rhReducer,
    paiements: paiementsReducer,
    depenses: depensesReducer,
    parametres: parametresReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;

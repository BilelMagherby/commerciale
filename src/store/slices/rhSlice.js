import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  conges: [],
  salaries: [],
  loading: false,
  error: null,
};

const rhSlice = createSlice({
  name: 'rh',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setConges: (state, action) => {
      state.conges = action.payload;
    },
    setSalaries: (state, action) => {
      state.salaries = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    addConge: (state, action) => {
      state.conges.push(action.payload);
    },
    addSalaire: (state, action) => {
      state.salaries.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(e => e.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setEmployees,
  setConges,
  setSalaries,
  addEmployee,
  addConge,
  addSalaire,
  updateEmployee,
  deleteEmployee,
  clearError,
} = rhSlice.actions;

export default rhSlice.reducer;

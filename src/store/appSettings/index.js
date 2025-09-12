import { createSlice } from '@reduxjs/toolkit';

import { appSettings as initialState } from '../initialState';

const { reducer, actions } = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
    setTab: (state, action) => {
      state[action.payload.type].tab = action.payload.tab;
    },
    setShowInactive: (state, action) => {
      state.transactions.showInactive = action.payload;
    },
    showLoading: (state) => {
      state.loading += 1;
    },
    hideLoading: (state) => {
      if (state.loading > 0) {
        state.loading -= 1;
      }
    },
  },
});

const { setSnackbar, setTab, setShowInactive, showLoading, hideLoading } =
  actions;
export { setSnackbar, setTab, setShowInactive, showLoading, hideLoading };
export default reducer;

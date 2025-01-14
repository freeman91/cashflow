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
  },
});

const { setSnackbar, setTab } = actions;
export { setSnackbar, setTab };
export default reducer;

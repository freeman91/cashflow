import { createSlice } from '@reduxjs/toolkit';
import { dialogs as initialState } from '../initialState';

const { reducer, actions } = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      const { mode, attrs } = action.payload;
      state[mode].open = true;
      state[mode].attrs = attrs;
    },
    closeDialog: (state, action) => {
      state.update = initialState.update;
      state.create = initialState.create;
      state.assets = initialState.assets;
      state.debts = initialState.debts;
    },
  },
  extraReducers: {},
});

const { openDialog, closeDialog } = actions;
export { openDialog, closeDialog };
export default reducer;

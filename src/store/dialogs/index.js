import { createSlice } from '@reduxjs/toolkit';
import { dialogs as initialState } from '../initialState';

const { reducer, actions } = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (state, action) => {
      const { type, mode, id, attrs } = action.payload;

      state[type].open = true;
      state[type].mode = mode;
      state[type].id = id;
      state[type].attrs = attrs;
    },
    closeDialog: (state, action) => {
      if (action.payload) {
        state[action.payload] = initialState[action.payload];
      } else {
        state = initialState;
      }
    },
  },
  extraReducers: {},
});

const { openDialog, closeDialog } = actions;
export { openDialog, closeDialog };
export default reducer;

import { createSlice } from '@reduxjs/toolkit';
import { itemView as initialState } from '../initialState';

const { reducer, actions } = createSlice({
  name: 'itemView',
  initialState,
  reducers: {
    openItemView: (state, action) => {
      const { itemType, mode, attrs } = action.payload;
      state.open = true;
      state.itemType = itemType;
      state.mode = mode;
      state.attrs = attrs;
    },
    closeItemView: (state, action) => {
      state.open = false;
      state.itemType = null;
      state.mode = null;
      state.attrs = {};
    },
  },
});

const { openItemView, closeItemView } = actions;
export { openItemView, closeItemView };
export default reducer;

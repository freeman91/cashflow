import { createSlice } from '@reduxjs/toolkit';

import { appSettings as initialState } from '../initialState';

const { reducer, actions } = createSlice({
  name: 'appSettings',
  initialState,
  reducers: {
    setAppBar: (state, action) => {
      state.appBar = action.payload;
    },
    setHandleCreateClick: (state, action) => {
      state.bottomNavigation.handleCreateClick = action.payload;
    },
  },
});

const { setAppBar, setHandleCreateClick } = actions;
export { setAppBar, setHandleCreateClick };
export default reducer;

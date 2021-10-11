import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { thunkReducer } from '../thunkTemplate';
import { settings as initialState } from '../initialState';

const setDialog = createAsyncThunk('settings/setDialog', ({ open, record }) => {
  return {
    dialog: {
      open,
      record,
    },
  };
});

const { reducer } = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(setDialog),
  },
});

export { setDialog };
export default reducer;

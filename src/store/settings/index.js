import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { thunkReducer } from '../thunkTemplate';
import { settings as initialState } from '../initialState';

const setUpdateDialog = createAsyncThunk(
  'settings/setUpdateDialog',
  ({ open, record }) => {
    return {
      updateDialog: {
        open,
        record,
      },
    };
  }
);

const setCreateDialog = createAsyncThunk(
  'settings/setCreateDialog',
  ({ open, date }) => {
    return {
      createDialog: {
        open,
        date,
      },
    };
  }
);

const { reducer } = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(setUpdateDialog),
    ...thunkReducer(setCreateDialog),
  },
});

export { setUpdateDialog, setCreateDialog };
export default reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getNetworthsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { hours as initialState } from '../initialState';

const getNetworths = createAsyncThunk('hours/getNetworths', async () => {
  try {
    const result = await getNetworthsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'hours',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getNetworths),
  },
});

export { getNetworths };
export default reducer;

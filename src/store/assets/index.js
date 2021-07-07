import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAssetsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { assets as initialState } from '../initialState';

const getAssets = createAsyncThunk('assets/getAssets', async () => {
  try {
    const result = await getAssetsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getAssets),
  },
});

export { getAssets };
export default reducer;

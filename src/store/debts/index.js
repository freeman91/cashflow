import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getDebtsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { debts as initialState } from '../initialState';

const getDebts = createAsyncThunk('debts/getDebts', async () => {
  try {
    const result = await getDebtsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'debts',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getDebts),
  },
});

export { getDebts };
export default reducer;

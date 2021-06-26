import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getRecentRecordsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { records as initialState } from '../initialState';
import { get } from 'lodash-es';

const getRecentRecords = createAsyncThunk(
  'records/getRecentRecords',
  async () => {
    try {
      const result = await getRecentRecordsAPI();
      return {
        expenses: get(result, 'expenses'),
        incomes: get(result, 'incomes'),
        hours: get(result, 'hours'),
        goals: get(result, 'goals'),
        assets: get(result, 'assets'), // TODO: move to asset reducer
        debts: get(result, 'debts'), // TODO: move to debt reducer
      };
    } catch (err) {
      console.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getRecentRecords),
  },
});

export { getRecentRecords };
export default reducer;

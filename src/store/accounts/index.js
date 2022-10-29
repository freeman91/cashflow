import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getAccountsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { accounts as initialState } from '../initialState';

const getAccounts = createAsyncThunk('accounts/getAccounts', async () => {
  try {
    const result = await getAccountsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getAccounts),
  },
});

export { getAccounts };
export default reducer;

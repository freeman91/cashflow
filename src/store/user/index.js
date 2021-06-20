import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUserAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { user as initialState } from '../initialState';

const getUser = createAsyncThunk('user/getUser', async () => {
  try {
    return await getUserAPI();
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getUser),
  },
});

export { getUser };
export default reducer;

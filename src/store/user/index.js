import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getUserAPI, putUserSettingsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { user as initialState } from '../initialState';

const getUser = createAsyncThunk('user/getUser', async () => {
  try {
    return await getUserAPI();
  } catch (err) {
    console.error(err);
  }
});

const putUserSettings = createAsyncThunk(
  'user/putUserSettings',
  async (payload) => {
    try {
      return await putUserSettingsAPI(payload);
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
    ...thunkReducer(getUser),
    ...thunkReducer(putUserSettings),
  },
});

export { getUser, putUserSettings };
export default reducer;

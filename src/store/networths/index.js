import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// import { getNetworthsAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

const getNetworths = createAsyncThunk(
  'networths/getNetworths',
  async (user_id) => {
    try {
      // const result = await getNetworthsAPI(user_id);
      // return {
      //   data: result,
      // };
    } catch (err) {
      console.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'networths',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getNetworths]);
  },
});

export { getNetworths };
export default reducer;

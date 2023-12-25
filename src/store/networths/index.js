import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

const { reducer, actions } = createSlice({
  name: 'networths',
  initialState,
  reducers: {
    setNetworths: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getNetworths]);
  },
});

const { setNetworths } = actions;

export { getNetworths, setNetworths };
export default reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';

import axios from '../../api/xhr_libs/axios';
import { processResponse } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';

const getHistories = createAsyncThunk(
  'histories/getHistories',
  async ({ user_id, range }, { dispatch }) => {
    try {
      // dispatch(showLoading());
      let histories = processResponse(
        await axios.get(`/histories/${user_id}`, {
          params: { start: range.start, end: range.end },
        })
      );
      return {
        data: sortBy(histories, 'month'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      // dispatch(hideLoading());
    }
  }
);

const { reducer } = createSlice({
  name: 'histories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getHistories]);
  },
});

export { getHistories };
export default reducer;

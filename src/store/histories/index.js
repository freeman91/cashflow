import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';

import axios from '../../api/xhr_libs/axios';
import { processResponse } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getHistories = createAsyncThunk(
  'histories/getHistories',
  async ({ user_id, range }, { dispatch, getState }) => {
    const { item: user } = getState().user;
    if (!user_id) user_id = user.user_id;

    let start = range?.start;
    let end = range?.end;
    if (!start) start = dayjs().subtract(6, 'month').format('YYYY-MM');
    if (!end) end = dayjs().format('YYYY-MM');

    try {
      dispatch(showLoading());
      let histories = processResponse(
        await axios.get(`/histories/${user_id}`, {
          params: { start, end },
        })
      );
      return {
        data: sortBy(histories, 'month'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
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

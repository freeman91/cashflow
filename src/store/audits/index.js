import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sortBy from 'lodash/sortBy';

import axios from '../../api/xhr_libs/axios';
import { processResponse } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getAudits = createAsyncThunk(
  'audits/getAudits',
  async (_, { dispatch, getState }) => {
    const { item: user } = getState().user;

    try {
      dispatch(showLoading());
      let audits = processResponse(await axios.get(`/audits/${user.user_id}`));
      return {
        data: sortBy(audits, 'timestamp').reverse(),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const { reducer } = createSlice({
  name: 'audits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getAudits]);
  },
});

export { getAudits };
export default reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import sortBy from 'lodash/sortBy';

import { getResourcesAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

const getNetworths = createAsyncThunk(
  'networths/getNetworths',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      let networths = await getResourcesAPI(user_id, 'networths');
      return {
        data: sortBy(networths, 'date'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
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

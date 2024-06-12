import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import sortBy from 'lodash/sortBy';

import { getResourcesAPI, saveNetworthAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';

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
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const saveNetworth = createAsyncThunk(
  'networths/saveNetworth',
  async (_, { dispatch, getState }) => {
    const { item } = getState().user;
    try {
      dispatch(showLoading());

      await saveNetworthAPI();
      dispatch(setSnackbar({ message: 'networth saved' }));
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
      dispatch(getNetworths(item.user_id));
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
    buildAsyncReducers(builder, [getNetworths, saveNetworth]);
  },
});

const { setNetworths } = actions;

export { getNetworths, setNetworths, saveNetworth };
export default reducer;

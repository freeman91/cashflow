import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { concat, get, remove, sortBy } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';

const getRepayments = createAsyncThunk(
  'repayments/getRepayments',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      const repayments = await getResourcesAPI(user_id, 'repayments');

      return {
        data: sortBy(repayments, 'date'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postRepayment = createAsyncThunk(
  'repayments/postRepayment',
  async (newRepayment, { dispatch, getState }) => {
    try {
      const { data: repayments } = getState().repayments;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newRepayment);

      if (result) {
        dispatch(setSnackbar({ message: 'repayment created' }));
      }
      return {
        data: [result].concat(repayments),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const putRepayment = createAsyncThunk(
  'repayments/putRepayment',
  async (updatedRepayment, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedRepayment);
      const { data: repayments } = getState().repayments;
      if (result) {
        dispatch(setSnackbar({ message: 'repayment updated' }));
      }
      let _repayments = [...repayments];
      remove(_repayments, {
        repayment_id: get(result, 'repayment_id'),
      });
      return {
        data: concat(_repayments, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteRepayment = createAsyncThunk(
  'repayments/deleteRepayment',
  async (id, { dispatch, getState }) => {
    try {
      const { data: repayments } = getState().repayments;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'repayment', id);

      if (result) {
        dispatch(setSnackbar({ message: 'repayment deleted' }));
      }
      let _repayments = [...repayments];
      remove(_repayments, { repayment_id: id });
      return {
        data: _repayments,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'repayments',
  initialState,
  reducers: {
    setRepayments: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getRepayments,
      postRepayment,
      putRepayment,
      deleteRepayment,
    ]);
  },
});

const { setRepayments } = actions;

export {
  postRepayment,
  getRepayments,
  putRepayment,
  deleteRepayment,
  setRepayments,
};
export default reducer;

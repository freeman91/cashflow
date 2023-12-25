import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import { cloneDeep, concat, get, remove, sortBy } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesInRangeAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { mergeResources } from '../../helpers';

const getRepayments = createAsyncThunk(
  'repayments/getRepayments',
  async ({ user_id, range }, { dispatch, getState }) => {
    let oldRepayments = cloneDeep(getState().repayments.data);

    try {
      dispatch(showLoading());
      const newRepayments = await getResourcesInRangeAPI(
        user_id,
        'repayments',
        range
      );

      let repayments = mergeResources(
        'repayment_id',
        oldRepayments,
        newRepayments
      );

      return {
        data: sortBy(repayments, 'date'),
      };
    } catch (err) {
      console.error(err);
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
        toastr.success('Repayment created');
      }
      return {
        data: [result].concat(repayments),
      };
    } catch (err) {
      toastr.error(err);
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
        toastr.success('Repayment updated');
      }
      let _repayments = [...repayments];
      remove(_repayments, {
        repayment_id: get(result, 'repayment_id'),
      });
      return {
        data: concat(_repayments, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteRepayment = createAsyncThunk(
  'repayments/deleteRepayment',
  async (id, { dispatch, getState }) => {
    try {
      const { data: repayments } = getState().repayments;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'repayments', id);

      if (result) {
        toastr.success('Repayment deleted');
      }
      let _repayments = [...repayments];
      remove(_repayments, { repayment_id: id });
      return {
        data: _repayments,
      };
    } catch (err) {
      toastr.error(err);
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

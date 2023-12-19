import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getRepayments = createAsyncThunk(
  'repayments/getRepayments',
  async (user) => {
    try {
      // return {
      //   data: await getRepaymentsAPI(user.user_id),
      // };
    } catch (err) {
      console.error(err);
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

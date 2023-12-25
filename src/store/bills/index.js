import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import { concat, get, remove } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

const getBills = createAsyncThunk(
  'bills/getBills',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'bills'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postBill = createAsyncThunk(
  'bills/postBill',
  async (newBill, { dispatch, getState }) => {
    try {
      const { data: bills } = getState().bills;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newBill);

      if (result) {
        toastr.success('Bill created');
      }
      return {
        data: [result].concat(bills),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putBill = createAsyncThunk(
  'bills/putBill',
  async (updatedBill, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedBill);
      const { data: bills } = getState().bills;
      if (result) {
        toastr.success('Bill updated');
      }
      let _bills = [...bills];
      remove(_bills, {
        bill_id: get(result, 'bill_id'),
      });
      return {
        data: concat(_bills, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (id, { dispatch, getState }) => {
    try {
      const { data: bills } = getState().bills;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'bills', id);

      if (result) {
        toastr.success('Bill deleted');
      }
      let _bills = [...bills];
      remove(_bills, { bill_id: id });
      return {
        data: _bills,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getBills, postBill, putBill, deleteBill]);
  },
});

const { setBills } = actions;

export { postBill, putBill, deleteBill, getBills, setBills };
export default reducer;

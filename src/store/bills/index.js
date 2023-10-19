import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';
import { toastr } from 'react-redux-toastr';

import { deleteBillAPI, getBillsAPI, postBillAPI, putBillAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { bills as initialState } from '../initialState';

const getBills = createAsyncThunk('bills/getBills', async () => {
  try {
    return {
      data: await getBillsAPI(),
    };
  } catch (err) {
    console.error(err);
  }
});

const postBill = createAsyncThunk(
  'bills/postBill',
  async (new_bill, { dispatch, getState }) => {
    try {
      const result = await postBillAPI(new_bill);
      const { data: bills } = getState().bills;
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
      const result = await putBillAPI(updatedBill);
      const { data: bills } = getState().bills;
      if (result) {
        toastr.success('Bill updated');
      }
      let _bills = [...bills];
      remove(_bills, {
        id: get(result, 'id'),
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
      const result = await deleteBillAPI(id);
      const { data: bills } = getState().bills;
      if (result) {
        toastr.success('Bill deleted');
      }

      let _bills = [...bills];
      remove(_bills, { id: id });
      return {
        data: _bills,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'bills',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postBill),
    ...thunkReducer(getBills),
    ...thunkReducer(putBill),
    ...thunkReducer(deleteBill),
  },
});

export { postBill, putBill, deleteBill, getBills };
export default reducer;

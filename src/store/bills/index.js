import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { get, remove, concat } from 'lodash';
import { toastr } from 'react-redux-toastr';

// import { deleteBillAPI, getBillsAPI, postBillAPI, putBillAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

const getBills = createAsyncThunk('bills/getBills', async (user_id) => {
  try {
    // return {
    //   data: await getBillsAPI(user_id),
    // };
  } catch (err) {
    console.error(err);
  }
});

const postBill = createAsyncThunk(
  'bills/postBill',
  async (new_bill, { dispatch, getState }) => {
    try {
      // const result = await postBillAPI(new_bill);
      // const { data: bills } = getState().bills;
      // if (result) {
      //   toastr.success('Bill created');
      // }
      // return {
      //   data: [result].concat(bills),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putBill = createAsyncThunk(
  'bills/putBill',
  async (updatedBill, { dispatch, getState }) => {
    try {
      // const result = await putBillAPI(updatedBill);
      // const { data: bills } = getState().bills;
      // if (result) {
      //   toastr.success('Bill updated');
      // }
      // let _bills = [...bills];
      // remove(_bills, {
      //   id: get(result, 'id'),
      // });
      // return {
      //   data: concat(_bills, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (id, { dispatch, getState }) => {
    try {
      // const result = await deleteBillAPI(id);
      // const { data: bills } = getState().bills;
      // if (result) {
      //   toastr.success('Bill deleted');
      // }
      // let _bills = [...bills];
      // remove(_bills, { id: id });
      // return {
      //   data: _bills,
      // };
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

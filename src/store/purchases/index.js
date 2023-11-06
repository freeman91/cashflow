import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { get, remove, concat } from 'lodash';

// import {
//   getPurchasesAPI,
//   postPurchaseAPI,
//   putPurchaseAPI,
//   deletePurchaseAPI,
// } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getPurchases = createAsyncThunk('expenses/getPurchases', async (user) => {
  try {
    // return {
    //   data: await getPurchasesAPI(user.user_id),
    // };
  } catch (err) {
    console.error(err);
  }
});

const postPurchase = createAsyncThunk(
  'purchases/postPurchase',
  async (new_purchase, { dispatch, getState }) => {
    try {
      // const result = await postPurchaseAPI(new_purchase);
      // const { data: purchases } = getState().purchases;
      // if (result) {
      //   toastr.success('Purchase created');
      // }
      // return {
      //   data: [result].concat(purchases),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putPurchase = createAsyncThunk(
  'purchases/putPurchase',
  async (updatedPurchase, { dispatch, getState }) => {
    try {
      // const result = await putPurchaseAPI(updatedPurchase);
      // const { data: purchases } = getState().purchases;
      // if (result) {
      //   toastr.success('Purchase updated');
      // }
      // let _purchases = [...purchases];
      // remove(_purchases, {
      //   id: get(result, 'purchase_id'),
      // });
      // return {
      //   data: concat(_purchases, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deletePurchase = createAsyncThunk(
  'purchases/deletePurchase',
  async (purchase_id, { dispatch, getState }) => {
    try {
      // const result = await deletePurchaseAPI(id);
      // const { data: purchases } = getState().purchases;
      // if (result) {
      //   toastr.success('Purchase deleted');
      // }
      // let _purchases = [...purchases];
      // remove(_purchases, { purchase_id });
      // return {
      //   data: _purchases,
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setPurchases: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getPurchases,
      postPurchase,
      putPurchase,
      deletePurchase,
    ]);
  },
});

const { setPurchases } = actions;

export {
  setPurchases,
  postPurchase,
  getPurchases,
  putPurchase,
  deletePurchase,
};
export default reducer;

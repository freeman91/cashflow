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

const getPurchases = createAsyncThunk(
  'purchases/getPurchases',
  async ({ user_id, range }, { dispatch, getState }) => {
    let oldPurchases = cloneDeep(getState().purchases.data);

    try {
      dispatch(showLoading());
      const newPurchases = await getResourcesInRangeAPI(
        user_id,
        'purchases',
        range
      );

      let purchases = mergeResources('purchase_id', oldPurchases, newPurchases);

      return {
        data: sortBy(purchases, 'date'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postPurchase = createAsyncThunk(
  'purchases/postPurchase',
  async (newPurchase, { dispatch, getState }) => {
    try {
      const { data: purchases } = getState().purchases;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newPurchase);

      if (result) {
        toastr.success('Purchase created');
      }
      return {
        data: [result].concat(purchases),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putPurchase = createAsyncThunk(
  'purchases/putPurchase',
  async (updatedPurchase, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedPurchase);
      const { data: purchases } = getState().purchases;
      if (result) {
        toastr.success('Purchase updated');
      }
      let _purchases = [...purchases];
      remove(_purchases, {
        purchase_id: get(result, 'purchase_id'),
      });
      return {
        data: concat(_purchases, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deletePurchase = createAsyncThunk(
  'purchases/deletePurchase',
  async (id, { dispatch, getState }) => {
    try {
      const { data: purchases } = getState().purchases;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'purchase', id);

      if (result) {
        toastr.success('Purchase deleted');
      }
      let _purchases = [...purchases];
      remove(_purchases, { purchase_id: id });
      return {
        data: _purchases,
      };
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

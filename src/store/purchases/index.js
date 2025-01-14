import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

const getPurchases = createAsyncThunk(
  'purchases/getPurchases',
  async (user_id, { dispatch }) => {
    try {
      // dispatch(showLoading());
      const purchases = await getResourcesAPI(user_id, 'purchases');

      return {
        data: sortBy(purchases, 'date'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      // dispatch(hideLoading());
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
        dispatch(setSnackbar({ message: 'purchase created' }));
      }
      return {
        data: [result].concat(purchases),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'purchase updated' }));
      }
      let _purchases = [...purchases];
      remove(_purchases, {
        purchase_id: get(result, 'purchase_id'),
      });
      return {
        data: concat(_purchases, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'purchase deleted' }));
      }
      let _purchases = [...purchases];
      remove(_purchases, { purchase_id: id });
      return { data: _purchases };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

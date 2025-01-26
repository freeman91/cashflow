import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import concat from 'lodash/concat';
import get from 'lodash/get';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import {
  deleteResourceAPI,
  getResourcesInRangeAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';
import { updateRange } from '../../helpers/dates';
import { mergeResources } from '../../helpers';

const getPurchases = createAsyncThunk(
  'purchases/getPurchases',
  async ({ user_id, range, force = false }, { dispatch, getState }) => {
    let {
      data: oldPurchases,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().purchases);
    let user = getState().user.item;

    if (!user_id) {
      user_id = user.user_id;
    }

    let [fetchRange, storeRange] = updateRange(range, oldStart, oldEnd);
    if (force) {
      fetchRange = range;
    }

    if (!fetchRange || !user_id) {
      return;
    }
    try {
      dispatch(showLoading());
      const newPurchases = await getResourcesInRangeAPI(
        user_id,
        'purchases',
        fetchRange
      );

      let purchases = mergeResources('purchase_id', oldPurchases, newPurchases);

      return {
        data: sortBy(purchases, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      console.error(err);
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

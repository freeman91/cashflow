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
import { updateAccount } from '../accounts';
import { updateSecurity } from '../securities';
import { updateRange } from '../../helpers/dates';
import { mergeResources } from '../../helpers';

const getSales = createAsyncThunk(
  'sales/getSales',
  async ({ user_id, range, force = false }, { dispatch, getState }) => {
    let {
      data: oldSales,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().sales);
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
      const newSales = await getResourcesInRangeAPI(
        user_id,
        'sales',
        fetchRange
      );

      let sales = mergeResources('sale_id', oldSales, newSales);

      return {
        data: sortBy(sales, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      console.error(err);
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postSale = createAsyncThunk(
  'sales/postSale',
  async (newSale, { dispatch, getState }) => {
    try {
      const { data: sales } = getState().sales;
      const { user_id } = getState().user.item;
      const { sale, deposit_account, withdraw_security } =
        await postResourceAPI(user_id, newSale);

      if (sale) {
        dispatch(setSnackbar({ message: 'sale created' }));
      }

      if (deposit_account) {
        await dispatch(updateAccount(deposit_account));
      }
      if (withdraw_security) {
        await dispatch(updateSecurity(withdraw_security));
      }

      return { data: [sale].concat(sales) };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const putSale = createAsyncThunk(
  'sales/putSale',
  async (updatedSale, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedSale);
      const { data: sales } = getState().sales;
      if (result) {
        dispatch(setSnackbar({ message: 'sale updated' }));
      }
      let _sales = [...sales];
      remove(_sales, {
        sale_id: get(result, 'sale_id'),
      });
      return {
        data: concat(_sales, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, { dispatch, getState }) => {
    try {
      const { data: sales } = getState().sales;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'sale', id);

      if (result) {
        dispatch(setSnackbar({ message: 'sale deleted' }));
      }
      let _sales = [...sales];
      remove(_sales, { sale_id: id });
      return {
        data: _sales,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSales: (state, action) => {
      state.sales = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getSales, postSale, putSale, deleteSale]);
  },
});

const { setSales } = actions;
export { postSale, getSales, putSale, deleteSale, setSales };
export default reducer;

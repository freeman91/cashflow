import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
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
import { updateAccount } from '../accounts';
import { updateSecurity } from '../securities';
const getSales = createAsyncThunk(
  'sales/getSales',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      const sales = await getResourcesAPI(user_id, 'sales');

      return { data: sortBy(sales, 'date') };
    } catch (err) {
      console.error(err);
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
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

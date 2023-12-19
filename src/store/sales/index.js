import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getSales = createAsyncThunk('sales/getSales', async (user) => {
  try {
    // return {
    //   data: await getSalesAPI(user.user_id),
    // };
  } catch (err) {
    console.error(err);
  }
});

const postSale = createAsyncThunk(
  'sales/postSale',
  async (newSale, { dispatch, getState }) => {
    try {
      const { data: sales } = getState().sales;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newSale);

      if (result) {
        toastr.success('Sale created');
      }
      return {
        data: [result].concat(sales),
      };
    } catch (err) {
      toastr.error(err);
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
        toastr.success('Sale updated');
      }
      let _sales = [...sales];
      remove(_sales, {
        sale_id: get(result, 'sale_id'),
      });
      return {
        data: concat(_sales, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, { dispatch, getState }) => {
    try {
      const { data: sales } = getState().sales;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'sales', id);

      if (result) {
        toastr.success('Sale deleted');
      }
      let _sales = [...sales];
      remove(_sales, { sale_id: id });
      return {
        data: _sales,
      };
    } catch (err) {
      toastr.error(err);
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

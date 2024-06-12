import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { concat, get, remove } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';

const getBills = createAsyncThunk(
  'bills/getBills',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'bills'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'bill created' }));
      }
      return {
        data: [result].concat(bills),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'bill updated' }));
      }
      let _bills = [...bills];
      remove(_bills, {
        bill_id: get(result, 'bill_id'),
      });
      return {
        data: concat(_bills, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (id, { dispatch, getState }) => {
    try {
      const { data: bills } = getState().bills;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'bill', id);

      if (result) {
        dispatch(setSnackbar({ message: 'bill deleted' }));
      }
      let _bills = [...bills];
      remove(_bills, { bill_id: id });
      return {
        data: _bills,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

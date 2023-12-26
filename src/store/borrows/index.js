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

const getBorrows = createAsyncThunk(
  'borrows/getBorrows',
  async ({ user_id, range }, { dispatch, getState }) => {
    let oldBorrows = cloneDeep(getState().borrows.data);

    try {
      dispatch(showLoading());
      const newBorrows = await getResourcesInRangeAPI(
        user_id,
        'borrows',
        range
      );

      let borrows = mergeResources('borrow_id', oldBorrows, newBorrows);

      return {
        data: sortBy(borrows, 'date'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postBorrow = createAsyncThunk(
  'borrows/postBorrow',
  async (newBorrow, { dispatch, getState }) => {
    try {
      const { data: borrows } = getState().borrows;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newBorrow);

      if (result) {
        toastr.success('Borrow created');
      }
      return {
        data: [result].concat(borrows),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putBorrow = createAsyncThunk(
  'borrows/putBorrow',
  async (updatedBorrow, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedBorrow);
      const { data: borrows } = getState().borrows;
      if (result) {
        toastr.success('Borrow updated');
      }
      let _borrows = [...borrows];
      remove(_borrows, {
        borrow_id: get(result, 'borrow_id'),
      });
      return {
        data: concat(_borrows, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteBorrow = createAsyncThunk(
  'borrows/deleteBorrow',
  async (borrow_id, { dispatch, getState }) => {
    try {
      const { data: borrows } = getState().borrows;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'borrow', borrow_id);

      if (result) {
        toastr.success('Borrow deleted');
      }
      let _borrows = [...borrows];
      remove(_borrows, { borrow_id });
      return {
        data: _borrows,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'borrows',
  initialState,
  reducers: {
    setBorrows: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getBorrows,
      postBorrow,
      putBorrow,
      deleteBorrow,
    ]);
  },
});

const { setBorrows } = actions;

export { postBorrow, getBorrows, putBorrow, deleteBorrow, setBorrows };
export default reducer;

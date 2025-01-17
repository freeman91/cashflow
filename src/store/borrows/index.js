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

const getBorrows = createAsyncThunk(
  'borrows/getBorrows',
  async ({ user_id, range }, { dispatch, getState }) => {
    let {
      data: oldBorrows,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().borrows);
    let user = getState().user.item;

    if (!user_id) {
      user_id = user.user_id;
    }

    const [fetchRange, storeRange] = updateRange(range, oldStart, oldEnd);

    if (!fetchRange || !user_id) {
      return;
    }

    try {
      dispatch(showLoading());
      const newBorrows = await getResourcesInRangeAPI(
        user_id,
        'borrows',
        fetchRange
      );

      let borrows = mergeResources('borrow_id', oldBorrows, newBorrows);

      return {
        data: sortBy(borrows, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'borrow created' }));
      }
      return {
        data: [result].concat(borrows),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'borrow updated' }));
      }
      let _borrows = [...borrows];
      remove(_borrows, {
        borrow_id: get(result, 'borrow_id'),
      });
      return {
        data: concat(_borrows, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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
        dispatch(setSnackbar({ message: 'borrow deleted' }));
      }
      let _borrows = [...borrows];
      remove(_borrows, { borrow_id });
      return {
        data: _borrows,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

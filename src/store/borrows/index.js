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

const getBorrows = createAsyncThunk(
  'borrows/getBorrows',
  async (user_id, { dispatch }) => {
    try {
      // dispatch(showLoading());
      const borrows = await getResourcesAPI(user_id, 'borrows');

      return {
        data: sortBy(borrows, 'date'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      // dispatch(hideLoading());
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

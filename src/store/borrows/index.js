import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getBorrows = createAsyncThunk('borrows/getBorrows', async (user_id) => {
  try {
    // return {
    //   data: await getBorrowsAPI(user_id),
    // };
  } catch (err) {
    console.error(err);
  }
});

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
      const result = await deleteResourceAPI(user_id, 'borrows', borrow_id);

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

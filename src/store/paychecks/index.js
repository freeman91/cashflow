import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getPaychecks = createAsyncThunk(
  'paychecks/getPaychecks',
  async (user) => {
    try {
      // return {
      //   data: await getPaychecksAPI(user.user_id),
      // };
    } catch (err) {
      console.error(err);
    }
  }
);

const postPaycheck = createAsyncThunk(
  'paychecks/postPaycheck',
  async (newPaycheck, { dispatch, getState }) => {
    try {
      const { data: paychecks } = getState().paychecks;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newPaycheck);

      if (result) {
        toastr.success('Paycheck created');
      }
      return {
        data: [result].concat(paychecks),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putPaycheck = createAsyncThunk(
  'paychecks/putPaycheck',
  async (updatedPaycheck, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedPaycheck);
      const { data: paychecks } = getState().paychecks;
      if (result) {
        toastr.success('Paycheck updated');
      }
      let _paychecks = [...paychecks];
      remove(_paychecks, {
        paycheck_id: get(result, 'paycheck_id'),
      });
      return {
        data: concat(_paychecks, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deletePaycheck = createAsyncThunk(
  'paychecks/deletePaycheck',
  async (id, { dispatch, getState }) => {
    try {
      const { data: paychecks } = getState().paychecks;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'paychecks', id);

      if (result) {
        toastr.success('Paycheck deleted');
      }
      let _paychecks = [...paychecks];
      remove(_paychecks, { paycheck_id: id });
      return {
        data: _paychecks,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'paychecks',
  initialState,
  reducers: {
    setPaychecks: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getPaychecks,
      postPaycheck,
      putPaycheck,
      deletePaycheck,
    ]);
  },
});

const { setPaychecks } = actions;

export {
  postPaycheck,
  getPaychecks,
  putPaycheck,
  deletePaycheck,
  setPaychecks,
};
export default reducer;

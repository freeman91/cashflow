import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { get, remove, concat } from 'lodash';

// import {
//   getPaychecksAPI,
//   postPaycheckAPI,
//   putPaycheckAPI,
//   deletePaycheckAPI,
// } from '../../api';
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
  async (new_paycheck, { dispatch, getState }) => {
    try {
      // const result = await postPaycheckAPI(new_paycheck);
      // const { data: paychecks } = getState().paychecks;
      // if (result) {
      //   toastr.success('Paycheck created');
      // }
      // return {
      //   data: [result].concat(paychecks),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putPaycheck = createAsyncThunk(
  'paychecks/putPaycheck',
  async (updatedPaycheck, { dispatch, getState }) => {
    try {
      // const result = await putPaycheckAPI(updatedPaycheck);
      // const { data: paychecks } = getState().paychecks;
      // if (result) {
      //   toastr.success('Paycheck updated');
      // }
      // let _paychecks = [...paychecks];
      // remove(_paychecks, {
      //   id: get(result, 'paycheck_id'),
      // });
      // return {
      //   data: concat(_paychecks, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deletePaycheck = createAsyncThunk(
  'paychecks/deletePaycheck',
  async (paycheck_id, { dispatch, getState }) => {
    try {
      // const result = await deletePaycheckAPI(id);
      // const { data: paychecks } = getState().paychecks;
      // if (result) {
      //   toastr.success('Paycheck deleted');
      // }
      // let _paychecks = [...paychecks];
      // remove(_paychecks, { paycheck_id });
      // return {
      //   data: _paychecks,
      // };
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, concat, remove } from 'lodash';
// import { getDebtsAPI, postDebtAPI, putDebtAPI, deleteDebtAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getDebts = createAsyncThunk('debts/getDebts', async (user_id) => {
  try {
    // const result = await getDebtsAPI(user_id);
    // return {
    //   data: result,
    // };
  } catch (err) {
    console.error(err);
  }
});

const postDebt = createAsyncThunk(
  'debts/postDebt',
  async (newDebt, { dispatch, getState }) => {
    try {
      // const result = await postDebtAPI(newDebt);
      // const { data: debts } = getState().debts;
      // if (result) {
      //   toastr.success('Debt created');
      // }
      // return {
      //   data: concat(debts, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putDebt = createAsyncThunk(
  'debts/putDebt',
  async (updatedDebt, { dispatch, getState }) => {
    try {
      // const result = await putDebtAPI(updatedDebt);
      // const { data: storeDebts } = getState().debts;
      // if (result) {
      //   toastr.success('Debt updated');
      // }
      // let _debts = [...storeDebts];
      // remove(_debts, {
      //   id: get(result, 'id'),
      // });
      // return {
      //   data: concat(_debts, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteDebt = createAsyncThunk(
  'debts/deleteDebt',
  async (id, { getState }) => {
    try {
      // const result = await deleteDebtAPI(id);
      // const { data: debts } = getState().debts;
      // if (result) {
      //   toastr.success('Debt deleted');
      // }
      // let _debts = [...debts];
      // remove(_debts, { id: id });
      // return {
      //   data: _debts,
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    setDebts: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getDebts, postDebt, putDebt, deleteDebt]);
  },
});

const { setDebts } = actions;

export { getDebts, postDebt, deleteDebt, putDebt, setDebts };
export default reducer;

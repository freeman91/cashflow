import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, concat, remove } from 'lodash';
import {
  getDebtsAPI,
  postDebtAPI,
  putDebtAPI,
  debtPaymentAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { debts as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getDebts = createAsyncThunk('debts/getDebts', async () => {
  try {
    const result = await getDebtsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const postDebt = createAsyncThunk(
  'debts/postDebt',
  async (newDebt, { dispatch, getState }) => {
    try {
      const result = await postDebtAPI(newDebt);
      const { data: debts } = getState().debts;
      if (result) {
        toastr.success('Debt created');
      }

      return {
        data: concat(debts, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putDebt = createAsyncThunk(
  'debts/putDebt',
  async (updatedDebt, { dispatch, getState }) => {
    try {
      const result = await putDebtAPI(updatedDebt);
      const { data: storeDebts } = getState().debts;
      if (result) {
        toastr.success('Debt updated');
      }
      let _debts = [...storeDebts];
      remove(_debts, {
        id: get(result, 'id'),
      });

      return {
        data: concat(_debts, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const debtPayment = createAsyncThunk(
  'debts/debtPayment',
  async (payload, { dispatch, getState }) => {
    try {
      const result = await debtPaymentAPI(get(payload, 'debt.id'), {
        amount: get(payload, 'amount'),
      });
      const { data: storeDebts } = getState().debts;
      if (result) {
        toastr.success('Debt updated');
      }
      let _debts = [...storeDebts];
      remove(_debts, {
        id: get(result, 'id'),
      });

      return {
        data: concat(_debts, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'debts',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getDebts),
    ...thunkReducer(postDebt),
    ...thunkReducer(putDebt),
    ...thunkReducer(debtPayment),
  },
});

export { getDebts, postDebt, putDebt, debtPayment };
export default reducer;

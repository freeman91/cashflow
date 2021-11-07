import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, concat, remove } from 'lodash';
import { addToastr, types } from '../toastr';
import {
  getDebtsAPI,
  postDebtAPI,
  putDebtAPI,
  debtPaymentAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { debts as initialState } from '../initialState';

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
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Debt created',
          })
        );
      }

      return {
        data: concat(debts, result),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
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
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Debt updated',
          })
        );
      }
      let _debts = [...storeDebts];
      remove(_debts, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_debts, result),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
    }
  }
);

const debtPayment = createAsyncThunk(
  'debts/debtPayment',
  async (payload, { dispatch, getState }) => {
    try {
      const result = await debtPaymentAPI(get(payload, 'debt._id'), {
        amount: get(payload, 'amount'),
      });
      const { data: storeDebts } = getState().debts;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Debt updated',
          })
        );
      }
      let _debts = [...storeDebts];
      remove(_debts, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_debts, result),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
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

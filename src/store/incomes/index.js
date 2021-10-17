import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { addToastr, types } from '../toastr';
import {
  getRecentIncomesAPI,
  postIncomeAPI,
  putIncomeAPI,
  deleteIncomeAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { incomes as initialState } from '../initialState';

const postIncome = createAsyncThunk(
  'incomes/postIncome',
  async (new_income, { dispatch, getState }) => {
    try {
      const result = await postIncomeAPI(new_income);
      const { data: incomes } = getState().incomes;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Income inserted',
          })
        );
      }
      return {
        data: [result].concat(incomes),
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

const putIncome = createAsyncThunk(
  'incomes/putIncome',
  async (updatedIncome, { dispatch, getState }) => {
    try {
      const result = await putIncomeAPI(updatedIncome);
      const { data: incomes } = getState().incomes;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Income updated',
          })
        );
      }
      let _incomes = [...incomes];
      remove(_incomes, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_incomes, result),
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

const deleteIncome = createAsyncThunk(
  'incomes/deleteIncome',
  async (id, { dispatch, getState }) => {
    try {
      const result = await deleteIncomeAPI(id);
      const { data: incomes } = getState().incomes;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Income deleted',
          })
        );
      }

      let _incomes = [...incomes];
      remove(_incomes, { _id: id });
      return {
        data: _incomes,
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

const getRecentIncomes = createAsyncThunk(
  'incomes/getRecentIncomes',
  async () => {
    try {
      const result = await getRecentIncomesAPI();
      return {
        data: result,
      };
    } catch (err) {
      console.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postIncome),
    ...thunkReducer(getRecentIncomes),
    ...thunkReducer(putIncome),
    ...thunkReducer(deleteIncome),
  },
});

export { postIncome, getRecentIncomes, putIncome, deleteIncome };
export default reducer;

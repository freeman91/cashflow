import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { addToastr, types } from '../toastr';
import {
  deleteExpenseAPI,
  getRecentExpensesAPI,
  postExpenseAPI,
  putExpenseAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { expenses as initialState } from '../initialState';

const postExpense = createAsyncThunk(
  'expenses/postExpense',
  async (new_expense, { dispatch, getState }) => {
    try {
      const result = await postExpenseAPI(new_expense);
      const { data: expenses } = getState().expenses;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Expense inserted',
          })
        );
      }
      return {
        data: [result].concat(expenses),
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

const putExpense = createAsyncThunk(
  'expenses/putExpense',
  async (updatedExpense, { dispatch, getState }) => {
    try {
      const result = await putExpenseAPI(updatedExpense);
      const { data: expenses } = getState().expenses;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Expense updated',
          })
        );
      }
      let _expenses = [...expenses];
      remove(_expenses, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_expenses, result),
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

const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { dispatch, getState }) => {
    try {
      const result = await deleteExpenseAPI(id);
      const { data: expenses } = getState().expenses;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Expense deleted',
          })
        );
      }

      let _expenses = [...expenses];
      remove(_expenses, { _id: id });
      return {
        data: _expenses,
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

const getRecentExpenses = createAsyncThunk(
  'expenses/getRecentExpenses',
  async () => {
    try {
      const result = await getRecentExpensesAPI();
      return {
        data: result,
      };
    } catch (err) {
      console.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postExpense),
    ...thunkReducer(getRecentExpenses),
    ...thunkReducer(putExpense),
    ...thunkReducer(deleteExpense),
  },
});

export { postExpense, putExpense, deleteExpense, getRecentExpenses };
export default reducer;

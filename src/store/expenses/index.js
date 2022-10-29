import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { addToastr, types } from '../toastr';
import {
  deleteExpenseAPI,
  getExpensesAPI,
  postExpenseAPI,
  putExpenseAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { expenses as initialState } from '../initialState';

const getExpenses = createAsyncThunk('expenses/getExpenses', async () => {
  try {
    return {
      data: await getExpensesAPI(),
    };
  } catch (err) {
    console.error(err);
  }
});

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
        id: get(result, 'id'),
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
      remove(_expenses, { id: id });
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

const { reducer } = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postExpense),
    ...thunkReducer(getExpenses),
    ...thunkReducer(putExpense),
    ...thunkReducer(deleteExpense),
  },
});

export { postExpense, putExpense, deleteExpense, getExpenses };
export default reducer;

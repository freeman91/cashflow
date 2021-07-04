import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { addToastr, types } from '../toastr';
import { getRecentExpensesAPI, postExpenseAPI } from '../../api';
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
  },
});

export { postExpense, getRecentExpenses };
export default reducer;

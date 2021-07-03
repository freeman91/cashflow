import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getRecentExpensesAPI, postExpenseAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { expenses as initialState } from '../initialState';

const postExpense = createAsyncThunk(
  'expenses/postExpense',
  async (new_expense, { dispatch, getState }) => {
    try {
      const result = await postExpenseAPI(new_expense);
      const expenses = getState().records.expenses;
      return {
        data: expenses.append(result),
      };
    } catch (err) {
      console.error(err);
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

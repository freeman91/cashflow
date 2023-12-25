import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import { cloneDeep, concat, get, remove, sortBy } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesInRangeAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { mergeResources } from '../../helpers';

const getExpenses = createAsyncThunk(
  'expenses/getExpenses',
  async ({ user_id, range }, { dispatch, getState }) => {
    let oldExpenses = cloneDeep(getState().expenses.data);

    try {
      dispatch(showLoading());
      const newExpenses = await getResourcesInRangeAPI(
        user_id,
        'expenses',
        range
      );

      let expenses = mergeResources('expense_id', oldExpenses, newExpenses);

      return {
        data: sortBy(expenses, 'date'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postExpense = createAsyncThunk(
  'expenses/postExpense',
  async (newExpense, { getState }) => {
    try {
      const { data: expenses } = getState().expenses;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newExpense);

      if (result) {
        toastr.success('Expense created');
      }
      return {
        data: [result].concat(expenses),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putExpense = createAsyncThunk(
  'expenses/putExpense',
  async (updatedExpense, { getState }) => {
    try {
      const result = await putResourceAPI(updatedExpense);
      const { data: expenses } = getState().expenses;
      if (result) {
        toastr.success('Expense updated');
      }
      let _expenses = [...expenses];
      remove(_expenses, {
        expense_id: get(result, 'expense_id'),
      });
      return {
        data: concat(_expenses, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { getState }) => {
    try {
      const { data: expenses } = getState().expenses;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'expenses', id);

      if (result) {
        toastr.success('Expense deleted');
      }
      let _expenses = [...expenses];
      remove(_expenses, { expense_id: id });
      return {
        data: _expenses,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getExpenses,
      postExpense,
      putExpense,
      deleteExpense,
    ]);
  },
});

const { setExpenses } = actions;

export { postExpense, putExpense, deleteExpense, getExpenses, setExpenses };
export default reducer;

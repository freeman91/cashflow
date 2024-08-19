import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
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
import { updateRange } from '../../helpers/dates';
import { setSnackbar } from '../appSettings';
import { updateAsset } from '../assets';
import { updateDebt } from '../debts';

const getExpenses = createAsyncThunk(
  'expenses/getExpenses',
  async ({ user_id, range }, { dispatch, getState }) => {
    let {
      data: oldExpenses,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().expenses);
    let user = getState().user.item;

    if (!user_id) {
      user_id = user.user_id;
    }

    const [fetchRange, storeRange] = updateRange(range, oldStart, oldEnd);

    if (!fetchRange || !user_id) {
      return;
    }

    try {
      dispatch(showLoading());
      const newExpenses = await getResourcesInRangeAPI(
        user_id,
        'expenses',
        fetchRange
      );

      let expenses = mergeResources('expense_id', oldExpenses, newExpenses);

      return {
        data: sortBy(expenses, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postExpense = createAsyncThunk(
  'expenses/postExpense',
  async (newExpense, { dispatch, getState }) => {
    try {
      const { data: expenses } = getState().expenses;
      const { user_id } = getState().user.item;
      const { expense, subaccount } = await postResourceAPI(
        user_id,
        newExpense
      );

      if (expense) {
        dispatch(setSnackbar({ message: 'expense created' }));
      }

      if (subaccount._type === 'asset') {
        dispatch(updateAsset(subaccount));
      } else if (subaccount._type === 'debt') {
        dispatch(updateDebt(subaccount));
      }

      return {
        data: [expense].concat(expenses),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const putExpense = createAsyncThunk(
  'expenses/putExpense',
  async (updatedExpense, { dispatch, getState }) => {
    const { data: expenses } = getState().expenses;

    try {
      const { expense, subaccount } = await putResourceAPI(updatedExpense);

      if (expense) {
        dispatch(setSnackbar({ message: 'expense updated' }));
      }
      let _expenses = [...expenses];
      remove(_expenses, {
        expense_id: get(expense, 'expense_id'),
      });

      if (subaccount._type === 'asset') {
        dispatch(updateAsset(subaccount));
      } else if (subaccount._type === 'debt') {
        dispatch(updateDebt(subaccount));
      }

      return {
        data: concat(_expenses, expense),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { dispatch, getState }) => {
    try {
      const expenses = getState().expenses.data;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'expense', id);
      if (result) {
        dispatch(setSnackbar({ message: 'expense deleted' }));
      }
      let _expenses = [...expenses];
      remove(_expenses, { expense_id: id });
      return {
        data: _expenses,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import concat from 'lodash/concat';
import get from 'lodash/get';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import axios from '../../api/xhr_libs/axios';
import { deleteResourceAPI, getResourcesAPI, processResponse } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getBudgets = createAsyncThunk(
  'budgets/getBudgets',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      const budgets = await getResourcesAPI(user_id, 'budgets');

      return {
        data: sortBy(budgets, 'date'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const putBudget = createAsyncThunk(
  'budgets/putBudget',
  async (updatedBudget, { dispatch, getState }) => {
    const { user_id } = getState().user.item;
    try {
      const result = processResponse(
        await axios.put(`/budgets/${user_id}`, updatedBudget)
      );
      const { data: budgets } = getState().budgets;
      if (result) {
        dispatch(setSnackbar({ message: 'budget updated' }));
      }
      let _budgets = [...budgets];
      remove(_budgets, {
        budget_id: get(result, 'budget_id'),
      });
      return {
        data: concat(_budgets, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (budget_id, { dispatch, getState }) => {
    try {
      const { data: budgets } = getState().budgets;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'budget', budget_id);

      if (result) {
        dispatch(setSnackbar({ message: 'budget deleted' }));
      }
      let _budgets = [...budgets];
      remove(_budgets, { budget_id });
      return {
        data: _budgets,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getBudgets, putBudget, deleteBudget]);
  },
});

const { setBudgets } = actions;

export { getBudgets, putBudget, deleteBudget, setBudgets };
export default reducer;

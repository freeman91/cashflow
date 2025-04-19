import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import concat from 'lodash/concat';
import get from 'lodash/get';
import remove from 'lodash/remove';

import axios from '../../api/xhr_libs/axios';
import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  processResponse,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';
import { openItemView } from '../itemView';
import { setExpenses } from '../expenses';
import { setRepayments } from '../repayments';
import { setIncomes } from '../incomes';
import { setPaychecks } from '../paychecks';

const getRecurrings = createAsyncThunk(
  'recurrings/getRecurrings',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'recurrings'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postRecurring = createAsyncThunk(
  'recurrings/postRecurring',
  async (newRecurring, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newRecurring);

      if (result) {
        dispatch(setSnackbar({ message: 'recurring created' }));
      }
      return {
        data: [result].concat(recurrings),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const putRecurring = createAsyncThunk(
  'recurrings/putRecurring',
  async (updatedRecurring, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedRecurring);
      const { data: recurrings } = getState().recurrings;
      if (result) {
        dispatch(setSnackbar({ message: 'recurring updated' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, {
        recurring_id: get(result, 'recurring_id'),
      });
      return {
        data: concat(_recurrings, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const generateNextRecurring = createAsyncThunk(
  'recurrings/generateNextRecurring',
  async (recurring_id, { dispatch, getState }) => {
    const { data: recurrings } = getState().recurrings;
    const { user_id } = getState().user.item;
    const result = await processResponse(
      await axios.put(`/recurrings/${user_id}/${recurring_id}/generate_next`)
    );

    if (result) {
      dispatch(setSnackbar({ message: 'recurring updated' }));
    }
    let _recurrings = [...recurrings];
    remove(_recurrings, { recurring_id: recurring_id });
    _recurrings.push(result.recurring);

    if (result.transaction._type === 'expense') {
      let _expenses = [...getState().expenses.data];
      _expenses.push(result.transaction);
      dispatch(setExpenses(_expenses));
    } else if (result.transaction._type === 'repayment') {
      let _repayments = [...getState().repayments.data];
      _repayments.push(result.transaction);
      dispatch(setRepayments(_repayments));
    } else if (result.transaction._type === 'income') {
      let _incomes = [...getState().incomes.data];
      _incomes.push(result.transaction);
      dispatch(setIncomes(_incomes));
    } else if (result.transaction._type === 'paycheck') {
      let _paychecks = [...getState().paychecks.data];
      _paychecks.push(result.transaction);
      dispatch(setPaychecks(_paychecks));
    }

    dispatch(
      openItemView({
        itemType: result.transaction._type,
        mode: 'edit',
        attrs: result.transaction,
      })
    );

    return {
      data: concat(_recurrings, result),
    };
  }
);

const deleteRecurring = createAsyncThunk(
  'recurrings/deleteRecurring',
  async (id, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'recurring', id);

      if (result) {
        dispatch(setSnackbar({ message: 'recurring deleted' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, { recurring_id: id });
      return {
        data: _recurrings,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deactivateRecurring = createAsyncThunk(
  'recurrings/deactivateRecurring',
  async (id, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = processResponse(
        await axios.put(`/recurrings/${user_id}/${id}`, {
          active: false,
        })
      );

      if (result) {
        dispatch(setSnackbar({ message: 'recurring deactivated' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, {
        recurring_id: get(result, 'recurring_id'),
      });
      return {
        data: concat(_recurrings, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'recurrings',
  initialState,
  reducers: {
    setRecurrings: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getRecurrings,
      postRecurring,
      putRecurring,
      generateNextRecurring,
      deleteRecurring,
      deactivateRecurring,
    ]);
  },
});

const { setRecurrings } = actions;

export {
  postRecurring,
  putRecurring,
  generateNextRecurring,
  deleteRecurring,
  getRecurrings,
  setRecurrings,
  deactivateRecurring,
};
export default reducer;

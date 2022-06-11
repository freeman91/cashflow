import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat, cloneDeep, map, includes } from 'lodash';

import { addToastr, types } from '../toastr';
import {
  getIncomesAPI,
  postIncomeAPI,
  putIncomeAPI,
  deleteIncomeAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { incomes as initialState } from '../initialState';
import dayjs from 'dayjs';

const getIncomes = createAsyncThunk(
  'incomes/getIncomes',
  async (range, { getState }) => {
    try {
      const { data: storeIncomes } = getState().incomes;
      let now = dayjs();
      let start = get(range, 'start');
      let stop = get(range, 'stop');

      if (!start) {
        start = now.subtract(4, 'month').date(1).hour(0).unix();
      }

      if (!stop) {
        stop = now.add(3, 'day').hour(23).unix();
      }

      let allIncomes = cloneDeep(storeIncomes);
      const incomes = await getIncomesAPI(start, stop);
      let updatedIncomeIds = map(incomes, (income) => income.id);

      remove(allIncomes, (income) => includes(updatedIncomeIds, income.id));
      return {
        data: concat(allIncomes, incomes),
      };
    } catch (err) {
      console.error(err);
    }
  }
);

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
        id: get(result, 'id'),
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
      remove(_incomes, { id: id });
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

const { reducer } = createSlice({
  name: 'incomes',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postIncome),
    ...thunkReducer(getIncomes),
    ...thunkReducer(putIncome),
    ...thunkReducer(deleteIncome),
  },
});

export { postIncome, getIncomes, putIncome, deleteIncome };
export default reducer;

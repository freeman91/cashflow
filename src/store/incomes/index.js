import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { addToastr, types } from '../toastr';
import { getRecentIncomesAPI, postIncomeAPI } from '../../api';
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
          message: `Error: ${err}`,
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
  },
});

export { postIncome, getRecentIncomes };
export default reducer;

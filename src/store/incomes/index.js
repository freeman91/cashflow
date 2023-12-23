import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getIncomes = createAsyncThunk('incomes/getIncomes', async (user_id) => {
  try {
    // return {
    //   data: await getIncomesAPI(user_id),
    // };
  } catch (err) {
    console.error(err);
  }
});

const postIncome = createAsyncThunk(
  'incomes/postIncome',
  async (newIncome, { dispatch, getState }) => {
    try {
      const { data: incomes } = getState().incomes;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newIncome);

      if (result) {
        toastr.success('Income created');
      }
      return {
        data: [result].concat(incomes),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putIncome = createAsyncThunk(
  'incomes/putIncome',
  async (updatedIncome, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedIncome);
      const { data: incomes } = getState().incomes;
      if (result) {
        toastr.success('Income updated');
      }
      let _incomes = [...incomes];
      remove(_incomes, {
        income_id: get(result, 'income_id'),
      });
      return {
        data: concat(_incomes, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteIncome = createAsyncThunk(
  'incomes/deleteIncome',
  async (id, { dispatch, getState }) => {
    try {
      const { data: incomes } = getState().incomes;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'incomes', id);

      if (result) {
        toastr.success('Income deleted');
      }
      let _incomes = [...incomes];
      remove(_incomes, { income_id: id });
      return {
        data: _incomes,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setIncomes: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getIncomes,
      postIncome,
      putIncome,
      deleteIncome,
    ]);
  },
});

const { setIncomes } = actions;

export { postIncome, getIncomes, putIncome, deleteIncome, setIncomes };
export default reducer;

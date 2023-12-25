import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toastr } from 'react-redux-toastr';

import { getUserAPI, putUserAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { user as initialState } from '../initialState';
import { setAccounts } from '../accounts';
import { setAssets } from '../assets';
import { setBills } from '../bills';
import { setBorrows } from '../borrows';
import { setDebts } from '../debts';
import { setExpenses } from '../expenses';
import { setIncomes } from '../incomes';
import { setOptionLists } from '../optionLists';
import { setPaychecks } from '../paychecks';
import { setPurchases } from '../purchases';
import { setRepayments } from '../repayments';
import { setSales } from '../sales';
import { setNetworths } from '../networths';

const getUser = createAsyncThunk(
  'user/getUser',
  async (user_id, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (user?.user_id || requestId !== currentRequestId) return;

    try {
      const result = await getUserAPI(user_id);
      const {
        accounts,
        assets,
        bills,
        borrows,
        debts,
        expenses,
        incomes,
        option_lists,
        paychecks,
        purchases,
        repayments,
        sales,
        user,
        networths,
      } = result;

      dispatch(setAccounts(accounts));
      dispatch(setAssets(assets));
      dispatch(setBills(bills));
      dispatch(setBorrows(borrows));
      dispatch(setDebts(debts));
      dispatch(setExpenses(expenses));
      dispatch(setIncomes(incomes));
      dispatch(setOptionLists(option_lists));
      dispatch(setPaychecks(paychecks));
      dispatch(setPurchases(purchases));
      dispatch(setRepayments(repayments));
      dispatch(setSales(sales));
      dispatch(setNetworths(networths));

      return { item: user };
    } catch (err) {
      console.error(err);
    }
  }
);

const putUser = createAsyncThunk(
  'users/putUser',
  async (updatedUser, { getState }) => {
    try {
      const user = await putUserAPI(updatedUser);
      if (user) {
        toastr.success('User updated');
      }
      return {
        item: user,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getUser, putUser]);
  },
});

export { getUser, putUser };
export default reducer;

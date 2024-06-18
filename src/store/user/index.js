import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import dayjs from 'dayjs';

import { getUserAPI, putUserAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { user as initialState } from '../initialState';
import { getAccounts } from '../accounts';
import { getAssets } from '../assets';
import { getBills } from '../bills';
import { getBorrows } from '../borrows';
import { getDebts } from '../debts';
import { getExpenses } from '../expenses';
import { getIncomes } from '../incomes';
import { getNetworths } from '../networths';
import { getPaychecks } from '../paychecks';
import { getPurchases } from '../purchases';
import { getRepayments } from '../repayments';
import { getSales } from '../sales';
import { getOptionLists } from '../optionLists';
import { getCategories } from '../categories';
import { setSnackbar } from '../appSettings';

const getUser = createAsyncThunk(
  'user/getUser',
  async (user_id, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (user?.user_id || requestId !== currentRequestId) return;

    const start = dayjs()
      .date(1)
      .subtract(1, 'month')
      .hour(0)
      .minute(0)
      .second(0);
    const end = start.add(3, 'month').date(0).hour(0).minute(0).second(0);

    try {
      dispatch(showLoading());

      const user = await getUserAPI(user_id);
      dispatch(getAccounts(user_id));
      dispatch(getAssets(user_id));
      dispatch(getBills(user_id));
      dispatch(getBorrows(user_id));
      dispatch(getDebts(user_id));
      dispatch(getExpenses({ user_id, range: { start, end } }));
      dispatch(getIncomes({ user_id, range: { start, end } }));
      dispatch(getNetworths(user_id));
      dispatch(getPaychecks({ user_id, range: { start, end } }));
      dispatch(getPurchases(user_id));
      dispatch(getRepayments(user_id));
      dispatch(getSales(user_id));
      dispatch(getOptionLists(user_id));
      dispatch(getCategories(user_id));

      return { item: user };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const refresh = createAsyncThunk(
  'user/refresh',
  async (_, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (requestId !== currentRequestId) return;

    const start = dayjs()
      .date(1)
      .subtract(1, 'month')
      .hour(0)
      .minute(0)
      .second(0);
    const end = start.add(3, 'month').date(0).hour(0).minute(0).second(0);

    try {
      dispatch(showLoading());

      dispatch(getAccounts(user.user_id));
      dispatch(getAssets(user.user_id));
      dispatch(getBills(user.user_id));
      dispatch(getBorrows(user.user_id));
      dispatch(getDebts(user.user_id));
      dispatch(getExpenses({ user_id: user.user_id, range: { start, end } }));
      dispatch(getIncomes({ user_id: user.user_id, range: { start, end } }));
      dispatch(getNetworths(user.user_id));
      dispatch(getPaychecks({ user_id: user.user_id, range: { start, end } }));
      dispatch(getPurchases(user.user_id));
      dispatch(getRepayments(user.user_id));
      dispatch(getSales(user.user_id));
      dispatch(getOptionLists(user.user_id));
      dispatch(getCategories(user.user_id));

      return {};
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const putUser = createAsyncThunk(
  'users/putUser',
  async (updatedUser, { dispatch }) => {
    try {
      const user = await putUserAPI(updatedUser);
      if (user) {
        dispatch(setSnackbar({ message: 'user updated' }));
      }
      return { item: user };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getUser, refresh, putUser]);
  },
});

export { getUser, refresh, putUser };
export default reducer;

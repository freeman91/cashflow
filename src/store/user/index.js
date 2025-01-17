import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import { getUserAPI, putUserAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { user as initialState } from '../initialState';
import { getAccounts } from '../accounts';
import { getBorrows } from '../borrows';
import { getBudgets } from '../budgets';
import { getExpenses } from '../expenses';
import { getHistories } from '../histories';
import { getIncomes } from '../incomes';
import { getPaychecks } from '../paychecks';
import { getPurchases } from '../purchases';
import { getRepayments } from '../repayments';
import { getSales } from '../sales';
import { getSecurities } from '../securities';
import { getCategories } from '../categories';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';
import { getRecurrings } from '../recurrings';

const getUser = createAsyncThunk(
  'user/getUser',
  async (user_id, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (user?.user_id || requestId !== currentRequestId) return;

    const start = dayjs()
      .date(1)
      .subtract(3, 'month')
      .hour(0)
      .minute(0)
      .second(0);
    const end = start.add(5, 'month').date(0).hour(0).minute(0).second(0);

    const historiesEnd = dayjs().format('YYYY-MM');
    const historiesStart = dayjs().subtract(6, 'month').format('YYYY-MM');

    try {
      dispatch(showLoading());

      // NOT IN RANGE
      const user = await getUserAPI(user_id);
      dispatch(getAccounts(user_id));
      dispatch(getBudgets(user_id));
      dispatch(getCategories(user_id));
      dispatch(getRecurrings(user_id));
      dispatch(getSecurities(user_id));

      //  IN RANGE
      dispatch(
        getHistories({
          user_id,
          range: { start: historiesStart, end: historiesEnd },
        })
      );
      dispatch(getExpenses({ user_id, range: { start, end } }));
      dispatch(getIncomes({ user_id, range: { start, end } }));
      dispatch(getPaychecks({ user_id, range: { start, end } }));
      dispatch(getRepayments({ user_id, range: { start, end } }));
      dispatch(getPurchases({ user_id, range: { start, end } }));
      dispatch(getSales({ user_id, range: { start, end } }));
      dispatch(getBorrows({ user_id, range: { start, end } }));

      return { item: user };
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

const refreshTransactions = createAsyncThunk(
  'user/refreshTransactions',
  async (user_id, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (requestId !== currentRequestId) return;
    if (!user_id) user_id = user.user_id;

    const start = dayjs()
      .date(1)
      .subtract(3, 'month')
      .hour(0)
      .minute(0)
      .second(0);
    const end = start.add(5, 'month').date(0).hour(0).minute(0).second(0);

    try {
      dispatch(showLoading());
      dispatch(getRecurrings(user_id));
      dispatch(getExpenses({ user_id, range: { start, end } }));
      dispatch(getIncomes({ user_id, range: { start, end } }));
      dispatch(getPaychecks({ user_id, range: { start, end } }));
      dispatch(getRepayments({ user_id, range: { start, end } }));
      dispatch(getPurchases({ user_id, range: { start, end } }));
      dispatch(getSales({ user_id, range: { start, end } }));
      dispatch(getBorrows({ user_id, range: { start, end } }));

      return {};
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const { reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getUser, putUser, refreshTransactions]);
  },
});

export { getUser, putUser, refreshTransactions };
export default reducer;

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

const fetchAllData = async (user_id, dispatch) => {
  const start = dayjs()
    .date(1)
    .subtract(6, 'month')
    .hour(0)
    .minute(0)
    .second(0);
  const end = dayjs().add(1, 'month').endOf('month');

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
    dispatch(getHistories({ user_id }));
    dispatch(getExpenses({ user_id, range: { start, end }, force: true }));
    dispatch(getIncomes({ user_id, range: { start, end }, force: true }));
    dispatch(getPaychecks({ user_id, range: { start, end }, force: true }));
    dispatch(getRepayments({ user_id, range: { start, end }, force: true }));
    dispatch(getPurchases({ user_id, range: { start, end }, force: true }));
    dispatch(getSales({ user_id, range: { start, end }, force: true }));
    dispatch(getBorrows({ user_id, range: { start, end }, force: true }));

    return { item: user };
  } catch (err) {
    console.error(err);
  } finally {
    dispatch(hideLoading());
  }
};

const getUser = createAsyncThunk(
  'user/getUser',
  async (user_id, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;
    if (user?.user_id || requestId !== currentRequestId) return;
    return fetchAllData(user_id, dispatch);
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
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const refreshAllData = createAsyncThunk(
  'user/refreshAllData',
  async (_, { dispatch, getState, requestId }) => {
    const { item: user, currentRequestId } = getState().user;

    if (requestId !== currentRequestId) return;
    return fetchAllData(user.user_id, dispatch);
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
      .subtract(6, 'month')
      .hour(0)
      .minute(0)
      .second(0);
    const end = dayjs().add(1, 'month').endOf('month');

    try {
      dispatch(showLoading());
      dispatch(getRecurrings(user_id));
      dispatch(getExpenses({ user_id, range: { start, end }, force: true }));
      dispatch(getIncomes({ user_id, range: { start, end }, force: true }));
      dispatch(getPaychecks({ user_id, range: { start, end }, force: true }));
      dispatch(getRepayments({ user_id, range: { start, end }, force: true }));
      dispatch(getPurchases({ user_id, range: { start, end }, force: true }));
      dispatch(getSales({ user_id, range: { start, end }, force: true }));
      dispatch(getBorrows({ user_id, range: { start, end }, force: true }));

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
    buildAsyncReducers(builder, [
      getUser,
      putUser,
      refreshTransactions,
      refreshAllData,
    ]);
  },
});

export { getUser, putUser, refreshTransactions, refreshAllData };
export default reducer;

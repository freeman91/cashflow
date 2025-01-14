import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
import { updateAccount } from '../accounts';

const getPaychecks = createAsyncThunk(
  'paychecks/getPaychecks',
  async ({ user_id, range }, { dispatch, getState }) => {
    let {
      data: oldPaychecks,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().paychecks);
    let user = getState().user.item;
    if (!user_id) {
      user_id = user.user_id;
    }

    const [fetchRange, storeRange] = updateRange(range, oldStart, oldEnd);

    if (!fetchRange || !user_id) {
      return;
    }

    try {
      // dispatch(showLoading());
      const newPaychecks = await getResourcesInRangeAPI(
        user_id,
        'paychecks',
        fetchRange
      );

      let paychecks = mergeResources('paycheck_id', oldPaychecks, newPaychecks);

      return {
        data: sortBy(paychecks, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      // dispatch(hideLoading());
    }
  }
);

const postPaycheck = createAsyncThunk(
  'paychecks/postPaycheck',
  async (newPaycheck, { dispatch, getState }) => {
    try {
      const { data: paychecks } = getState().paychecks;
      const { user_id } = getState().user.item;
      const { paycheck, account } = await postResourceAPI(user_id, newPaycheck);

      if (paycheck) {
        dispatch(setSnackbar({ message: 'paycheck created' }));
      }

      if (account) {
        dispatch(updateAccount(account));
      }

      return {
        data: [paycheck].concat(paychecks),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const putPaycheck = createAsyncThunk(
  'paychecks/putPaycheck',
  async (updatedPaycheck, { dispatch, getState }) => {
    try {
      const { paycheck, account } = await putResourceAPI(updatedPaycheck);
      const { data: paychecks } = getState().paychecks;
      if (paycheck) {
        dispatch(setSnackbar({ message: 'paycheck updated' }));
      }

      if (account) {
        dispatch(updateAccount(account));
      }

      let _paychecks = [...paychecks];
      remove(_paychecks, {
        paycheck_id: get(paycheck, 'paycheck_id'),
      });
      return {
        data: concat(_paychecks, paycheck),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deletePaycheck = createAsyncThunk(
  'paychecks/deletePaycheck',
  async (id, { dispatch, getState }) => {
    try {
      const { data: paychecks } = getState().paychecks;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'paycheck', id);

      if (result) {
        dispatch(setSnackbar({ message: 'paycheck deleted' }));
      }
      let _paychecks = [...paychecks];
      remove(_paychecks, { paycheck_id: id });
      return { data: _paychecks };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'paychecks',
  initialState,
  reducers: {
    setPaychecks: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getPaychecks,
      postPaycheck,
      putPaycheck,
      deletePaycheck,
    ]);
  },
});

const { setPaychecks } = actions;

export {
  postPaycheck,
  getPaychecks,
  putPaycheck,
  deletePaycheck,
  setPaychecks,
};
export default reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';
import concat from 'lodash/concat';
import get from 'lodash/get';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

import {
  deleteResourceAPI,
  getResourcesInRangeAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { updateAccount } from '../accounts';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';
import { updateRange } from '../../helpers/dates';
import { mergeResources } from '../../helpers';

const getRepayments = createAsyncThunk(
  'repayments/getRepayments',
  async ({ user_id, range }, { dispatch, getState }) => {
    let {
      data: oldRepayments,
      start: oldStart,
      end: oldEnd,
    } = cloneDeep(getState().repayments);
    let user = getState().user.item;

    if (!user_id) {
      user_id = user.user_id;
    }

    const [fetchRange, storeRange] = updateRange(range, oldStart, oldEnd);

    if (!fetchRange || !user_id) {
      return;
    }

    try {
      dispatch(showLoading());
      const newRepayments = await getResourcesInRangeAPI(
        user_id,
        'repayments',
        fetchRange
      );

      let repayments = mergeResources(
        'repayment_id',
        oldRepayments,
        newRepayments
      );

      return {
        data: sortBy(repayments, 'date'),
        start: storeRange.start,
        end: storeRange.end,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postRepayment = createAsyncThunk(
  'repayments/postRepayment',
  async (newRepayment, { dispatch, getState }) => {
    try {
      const { data: repayments } = getState().repayments;
      const { user_id } = getState().user.item;
      const { repayment, account } = await postResourceAPI(
        user_id,
        newRepayment
      );

      if (repayment) {
        dispatch(setSnackbar({ message: 'repayment created' }));
      }

      if (account) {
        dispatch(updateAccount(account));
      }

      return {
        data: [repayment].concat(repayments),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const putRepayment = createAsyncThunk(
  'repayments/putRepayment',
  async (updatedRepayment, { dispatch, getState }) => {
    const { data: repayments } = getState().repayments;

    try {
      const { repayment, account, liability_account } = await putResourceAPI(
        updatedRepayment
      );

      if (repayment) {
        dispatch(setSnackbar({ message: 'repayment updated' }));
      }
      let _repayments = [...repayments];
      remove(_repayments, {
        repayment_id: get(repayment, 'repayment_id'),
      });

      for (const _account of [account, liability_account]) {
        if (_account) {
          dispatch(updateAccount(_account));
        }
      }

      return {
        data: concat(_repayments, repayment),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const deleteRepayment = createAsyncThunk(
  'repayments/deleteRepayment',
  async (id, { dispatch, getState }) => {
    try {
      const { data: repayments } = getState().repayments;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'repayment', id);

      if (result) {
        dispatch(setSnackbar({ message: 'repayment deleted' }));
      }
      let _repayments = [...repayments];
      remove(_repayments, { repayment_id: id });
      return {
        data: _repayments,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: `error: ${err}` }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'repayments',
  initialState,
  reducers: {
    setRepayments: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getRepayments,
      postRepayment,
      putRepayment,
      deleteRepayment,
    ]);
  },
});

const { setRepayments } = actions;

export {
  postRepayment,
  getRepayments,
  putRepayment,
  deleteRepayment,
  setRepayments,
};
export default reducer;

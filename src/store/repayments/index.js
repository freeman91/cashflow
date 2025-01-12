import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { concat, get, remove, sortBy } from 'lodash';

import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { setSnackbar } from '../appSettings';
import { updateAccount } from '../accounts';

const getRepayments = createAsyncThunk(
  'repayments/getRepayments',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      const repayments = await getResourcesAPI(user_id, 'repayments');

      return {
        data: sortBy(repayments, 'date'),
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

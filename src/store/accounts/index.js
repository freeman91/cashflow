import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import concat from 'lodash/concat';
import get from 'lodash/get';
import remove from 'lodash/remove';

import axios from '../../api/xhr_libs/axios';
import {
  deleteResourceAPI,
  getResourcesAPI,
  postResourceAPI,
  processResponse,
  putResourceAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getAccounts = createAsyncThunk(
  'accounts/getAccounts',
  async (user_id, { dispatch, getState }) => {
    const { item: user } = getState().user;

    if (!user_id) user_id = user.user_id;

    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'accounts'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postAccount = createAsyncThunk(
  'accounts/postAccountAPI',
  async (newAccount, { dispatch, getState }) => {
    try {
      const { data: accounts } = getState().accounts;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newAccount);

      if (result) {
        dispatch(setSnackbar({ message: 'account created' }));
      }
      return {
        data: [result].concat(accounts),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const putAccount = createAsyncThunk(
  'accounts/putAccount',
  async (updatedAccount, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedAccount);
      const { data: accounts } = getState().accounts;
      if (result) {
        dispatch(setSnackbar({ message: 'account updated' }));
      }
      let _accounts = [...accounts];
      remove(_accounts, {
        account_id: get(result, 'account_id'),
      });
      return {
        data: concat(_accounts, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (id, { dispatch, getState }) => {
    try {
      const { data: accounts } = getState().accounts;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'account', id);

      if (result) {
        dispatch(setSnackbar({ message: 'account deleted' }));
      }
      let _accounts = [...accounts];
      remove(_accounts, { account_id: id });
      return {
        data: _accounts,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deactivateAccount = createAsyncThunk(
  'accounts/deactivateAccount',
  async (id, { dispatch, getState }) => {
    try {
      const { data: accounts } = getState().accounts;
      const { user_id } = getState().user.item;
      const result = processResponse(
        await axios.put(`/accounts/${user_id}/${id}`, {
          active: false,
        })
      );

      if (result) {
        dispatch(setSnackbar({ message: 'account deactivated' }));
      }
      let _accounts = [...accounts];
      remove(_accounts, {
        account_id: get(result, 'account_id'),
      });
      return {
        data: concat(_accounts, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.data = action.payload;
    },
    updateAccount: (state, action) => {
      const { data: accounts } = state;
      let _accounts = [...accounts];

      const index = _accounts.findIndex(
        (account) => account.account_id === action.payload.account_id
      );
      _accounts[index] = action.payload;
      state.data = _accounts;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getAccounts,
      postAccount,
      putAccount,
      deleteAccount,
      deactivateAccount,
    ]);
  },
});

const { setAccounts, updateAccount } = actions;

export {
  getAccounts,
  postAccount,
  putAccount,
  deleteAccount,
  deactivateAccount,
  setAccounts,
  updateAccount,
};
export default reducer;

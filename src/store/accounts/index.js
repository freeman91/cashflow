import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// import { getAccountsAPI, postAccountAPI, putAccountAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { concat, get, remove } from 'lodash';
import { toastr } from 'react-redux-toastr';

const getAccounts = createAsyncThunk(
  'accounts/getAccounts',
  async (user_id) => {
    try {
      // const result = await getAccountsAPI(user_id);
      // return {
      //   data: result,
      // };
    } catch (err) {
      console.error(err);
    }
  }
);

const postAccount = createAsyncThunk(
  'accounts/postAccountAPI',
  async (newAccount, { dispatch, getState }) => {
    try {
      // const result = await postAccountAPI(newAccount);
      // const { data: accounts } = getState().accounts;
      // if (result) {
      //   toastr.success('Account created');
      // }
      // return {
      //   data: concat(accounts, result),
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putAccount = createAsyncThunk(
  'accounts/putAccount',
  async (updatedAccount, { dispatch, getState }) => {
    try {
      // const result = await putAccountAPI(updatedAccount);
      // const { data: storeAccounts } = getState().accounts;
      // if (result) {
      //   toastr.success('Account updated');
      // }
      // let _accounts = [...storeAccounts];
      // remove(_accounts, {
      //   id: get(result, 'id'),
      // });
      // return {
      //   data: concat(_accounts, result),
      // };
    } catch (err) {
      toastr.error(err);
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
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getAccounts, postAccount, putAccount]);
  },
});

const { setAccounts } = actions;

export { getAccounts, postAccount, putAccount, setAccounts };
export default reducer;

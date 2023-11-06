import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import {
  // getOptionListsAPI,
  postOptionListAPI,
  putOptionListAPI,
  // deleteOptionListAPI,
} from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getOptionLists = createAsyncThunk(
  'optionLists/getOptionLists',
  async (user) => {
    try {
      // return {
      //   data: await getOptionListsAPI(user.user_id),
      // };
    } catch (err) {
      console.error(err);
    }
  }
);

const postOptionList = createAsyncThunk(
  'optionLists/postOptionList',
  async (newOptionList, { dispatch, getState }) => {
    const { data: optionLists } = getState().optionLists;
    const user_id = getState().user.item.user_id;
    try {
      const result = await postOptionListAPI(user_id, newOptionList);
      if (result) {
        toastr.success('OptionList created');
      }
      return {
        data: [result].concat(optionLists),
      };
    } catch (err) {
      // toastr.error(err);
      console.log('err: ', err);
    }
  }
);

const putOptionList = createAsyncThunk(
  'optionLists/putOptionList',
  async (updatedOptionList, { getState }) => {
    const optionLists = getState().optionLists.data;

    try {
      const result = await putOptionListAPI(updatedOptionList);
      if (result) {
        toastr.success('OptionList updated');
      }

      let _optionLists = [...optionLists];
      remove(_optionLists, {
        option_type: get(result, 'option_type'),
      });

      return {
        data: concat(_optionLists, result),
      };
    } catch (err) {
      // toastr.error(err);
    }
  }
);

const deleteOptionList = createAsyncThunk(
  'optionLists/deleteOptionList',
  async (option_list_id, { dispatch, getState }) => {
    try {
      // const result = await deleteOptionListAPI(option_list_id);
      // const { data: optionLists } = getState().optionLists;
      // if (result) {
      //   toastr.success('OptionList deleted');
      // }
      // let _optionLists = [...optionLists];
      // remove(_optionLists, { option_list_id });
      // return {
      //   data: _optionLists,
      // };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'optionLists',
  initialState,
  reducers: {
    setOptionLists: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getOptionLists,
      postOptionList,
      putOptionList,
      deleteOptionList,
    ]);
  },
});

const { setOptionLists } = actions;
export {
  postOptionList,
  getOptionLists,
  putOptionList,
  deleteOptionList,
  setOptionLists,
};
export default reducer;

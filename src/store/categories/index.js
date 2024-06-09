import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import { get, remove, concat } from 'lodash';

import { getResourcesAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { putCategoryAPI } from '../../api/categories';

const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'categories'),
      };
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(hideLoading());
    }
  }
);

const putCategories = createAsyncThunk(
  'categories/putCategories',
  async (updatedItem, { getState }) => {
    const categories = getState().categories.data;

    try {
      const result = await putCategoryAPI(updatedItem);
      if (result) {
        toastr.success('Categories updated');
      }

      let _categories = [...categories];
      remove(_categories, {
        category_type: get(result, 'category_type'),
      });

      return {
        data: concat(_categories, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setOptionLists: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getCategories, putCategories]);
  },
});

const { setCategories } = actions;
export { getCategories, putCategories, setCategories };
export default reducer;

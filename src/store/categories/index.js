import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { getResourcesAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { putCategoryAPI } from '../../api/categories';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'categories'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const putCategories = createAsyncThunk(
  'categories/putCategories',
  async (updatedItem, { dispatch, getState }) => {
    const categories = getState().categories.data;

    try {
      const result = await putCategoryAPI(updatedItem);
      if (result) {
        dispatch(setSnackbar({ message: 'categories updated' }));
      }

      let _categories = [...categories];
      remove(_categories, {
        category_type: get(result, 'category_type'),
      });

      return {
        data: concat(_categories, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
// import { toastr } from 'react-redux-toastr';
// import { get, remove, concat } from 'lodash';

import { getResourcesAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';

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

// const postCategories = createAsyncThunk(
//   'optionLists/postCategories',
//   async (newCategories, { dispatch, getState }) => {
//     const { data: optionLists } = getState().optionLists;
//     const user_id = getState().user.item.user_id;
//     try {
//       const result = await postCategoriesAPI(user_id, newCategories);
//       if (result) {
//         toastr.success('Categories created');
//       }
//       return {
//         data: [result].concat(optionLists),
//       };
//     } catch (err) {
//       // toastr.error(err);
//       console.log('err: ', err);
//     }
//   }
// );

// const putCategories = createAsyncThunk(
//   'optionLists/putCategories',
//   async (updatedCategories, { getState }) => {
//     const optionLists = getState().optionLists.data;

//     try {
//       const result = await putCategoriesAPI(updatedCategories);
//       if (result) {
//         toastr.success('Categories updated');
//       }

//       let _optionLists = [...optionLists];
//       remove(_optionLists, {
//         option_type: get(result, 'option_type'),
//       });

//       return {
//         data: concat(_optionLists, result),
//       };
//     } catch (err) {
//       // toastr.error(err);
//     }
//   }
// );

// const deleteCategories = createAsyncThunk(
//   'optionLists/deleteCategories',
//   async (option_list_id, { dispatch, getState }) => {
//     try {
//       // const result = await deleteCategoriesAPI(option_list_id);
//       // const { data: optionLists } = getState().optionLists;
//       // if (result) {
//       //   toastr.success('OptionList deleted');
//       // }
//       // let _optionLists = [...optionLists];
//       // remove(_optionLists, { option_list_id });
//       // return {
//       //   data: _optionLists,
//       // };
//     } catch (err) {
//       toastr.error(err);
//     }
//   }
// );

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
      getCategories,
      // postCategories,
      // putCategories,
      // deleteCategories,
    ]);
  },
});

const { setCategories } = actions;
export {
  getCategories,
  // postCategories,
  // putCategories,
  // deleteCategories,
  setCategories,
};
export default reducer;

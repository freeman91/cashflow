import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { deleteResourceAPI, postResourceAPI, putResourceAPI } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getAssets = createAsyncThunk('assets/getAssets', async (user_id) => {
  try {
    // const result = await getAssetsAPI(user_id);
    // return {
    //   data: result,
    // };
  } catch (err) {
    console.error(err);
  }
});

const postAsset = createAsyncThunk(
  'assets/postAsset',
  async (newAsset, { dispatch, getState }) => {
    try {
      const { data: assets } = getState().assets;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newAsset);

      if (result) {
        toastr.success('Asset created');
      }
      return {
        data: [result].concat(assets),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const putAsset = createAsyncThunk(
  'assets/putAsset',
  async (updatedAsset, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedAsset);
      const { data: assets } = getState().assets;
      if (result) {
        toastr.success('Asset updated');
      }
      let _assets = [...assets];
      remove(_assets, {
        asset_id: get(result, 'asset_id'),
      });
      return {
        data: concat(_assets, result),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const deleteAsset = createAsyncThunk(
  'assets/deleteAsset',
  async (id, { getState }) => {
    try {
      const { data: assets } = getState().assets;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'assets', id);

      if (result) {
        toastr.success('Asset deleted');
      }
      let _assets = [...assets];
      remove(_assets, { asset_id: id });
      return {
        data: _assets,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setAssets: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [getAssets, postAsset, putAsset, deleteAsset]);
  },
});

const { setAssets } = actions;

export { getAssets, putAsset, postAsset, deleteAsset, setAssets };
export default reducer;

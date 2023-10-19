import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import {
  getAssetsAPI,
  putAssetAPI,
  buyAssetAPI,
  sellAssetAPI,
  postAssetAPI,
  deleteAssetAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { assets as initialState } from '../initialState';
import { toastr } from 'react-redux-toastr';

const getAssets = createAsyncThunk('assets/getAssets', async () => {
  try {
    const result = await getAssetsAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const postAsset = createAsyncThunk(
  'assets/postAsset',
  async (newAsset, { dispatch, getState }) => {
    try {
      const result = await postAssetAPI(newAsset);
      const { data: assets } = getState().assets;
      if (result) {
        toastr.success('Asset created');
      }

      return {
        data: concat(assets, result),
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
      const result = await putAssetAPI(updatedAsset);
      const { data: storeAssets } = getState().assets;
      if (result) {
        toastr.success('Asset updated');
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        id: get(result, 'id'),
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
      const result = await deleteAssetAPI(id);
      const { data: assets } = getState().assets;
      if (result) {
        toastr.success('Asset deleted');
      }

      let _assets = [...assets];
      remove(_assets, { id: id });
      return {
        data: _assets,
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const buyAsset = createAsyncThunk(
  'assets/sellAsset',
  async (payload, { dispatch, getState }) => {
    let assetId = get(payload, 'asset.id');
    let _payload = {
      shares: get(payload, 'shares'),
      price: get(payload, 'price'),
      vendor: get(payload, 'vendor'),
    };
    try {
      const result = await buyAssetAPI(assetId, _payload);
      const { data: storeAssets } = getState().assets;

      if (result) {
        toastr.success('Shares purchased');
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        id: get(result, 'id'),
      });
      let updatedAsset = get(result, 'updated_asset');
      return {
        data: concat(_assets, updatedAsset),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const sellAsset = createAsyncThunk(
  'assets/sellAsset',
  async (payload, { dispatch, getState }) => {
    let assetId = get(payload, 'asset.id');
    let _payload = {
      shares: get(payload, 'shares'),
      price: get(payload, 'price'),
      source: get(payload, 'vendor'),
    };
    try {
      const result = await sellAssetAPI(assetId, _payload);
      const { data: storeAssets } = getState().assets;
      if (result) {
        toastr.success('Shares sold');
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        id: get(result, 'id'),
      });
      let updatedAsset = get(result, 'updated_asset');
      return {
        data: concat(_assets, updatedAsset),
      };
    } catch (err) {
      toastr.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'assets',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getAssets),
    ...thunkReducer(putAsset),
    ...thunkReducer(deleteAsset),
    ...thunkReducer(postAsset),
    ...thunkReducer(sellAsset),
    ...thunkReducer(buyAsset),
  },
});

export { getAssets, putAsset, postAsset, deleteAsset, sellAsset, buyAsset };
export default reducer;

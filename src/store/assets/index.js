import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import {
  getAssetsAPI,
  putAssetAPI,
  buyAssetAPI,
  sellAssetAPI,
  postAssetAPI,
} from '../../api';
import { addToastr, types } from '../toastr';
import { thunkReducer } from '../thunkTemplate';
import { assets as initialState } from '../initialState';

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

const putAsset = createAsyncThunk(
  'assets/putAsset',
  async (updatedAsset, { dispatch, getState }) => {
    try {
      const result = await putAssetAPI(updatedAsset);
      const { data: storeAssets } = getState().assets;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Asset updated',
          })
        );
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_assets, result),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
    }
  }
);

const buyAsset = createAsyncThunk(
  'assets/sellAsset',
  async (payload, { dispatch, getState }) => {
    let assetId = get(payload, 'asset._id');
    let _payload = {
      shares: get(payload, 'shares'),
      price: get(payload, 'price'),
      vendor: get(payload, 'vendor'),
    };
    try {
      const result = await buyAssetAPI(assetId, _payload);
      const { data: storeAssets } = getState().assets;

      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Shares bought',
          })
        );
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        _id: get(result, '_id'),
      });
      let updatedAsset = get(result, 'updated_asset');
      return {
        data: concat(_assets, updatedAsset),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
    }
  }
);

const sellAsset = createAsyncThunk(
  'assets/sellAsset',
  async (payload, { dispatch, getState }) => {
    let assetId = get(payload, 'asset._id');
    let _payload = {
      shares: get(payload, 'shares'),
      price: get(payload, 'price'),
      source: get(payload, 'vendor'),
    };
    try {
      const result = await sellAssetAPI(assetId, _payload);
      const { data: storeAssets } = getState().assets;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Shares sold',
          })
        );
      }
      let _assets = [...storeAssets];
      remove(_assets, {
        _id: get(result, '_id'),
      });
      let updatedAsset = get(result, 'updated_asset');
      return {
        data: concat(_assets, updatedAsset),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
    }
  }
);

const postAsset = createAsyncThunk(
  'assets/postAsset',
  async (updatedAsset, { dispatch, getState }) => {
    try {
      const result = await postAssetAPI(updatedAsset);
      const { data: assets } = getState().assets;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Asset created',
          })
        );
      }

      return {
        data: concat(assets, result),
      };
    } catch (err) {
      dispatch(
        addToastr({
          type: types.error,
          title: 'Error',
          message: err,
        })
      );
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
    ...thunkReducer(postAsset),
    ...thunkReducer(sellAsset),
    ...thunkReducer(buyAsset),
  },
});

export { getAssets, putAsset, postAsset, sellAsset, buyAsset };
export default reducer;

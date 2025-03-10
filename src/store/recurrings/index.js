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

const getRecurrings = createAsyncThunk(
  'recurrings/getRecurrings',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'recurrings'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postRecurring = createAsyncThunk(
  'recurrings/postRecurring',
  async (newRecurring, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = await postResourceAPI(user_id, newRecurring);

      if (result) {
        dispatch(setSnackbar({ message: 'recurring created' }));
      }
      return {
        data: [result].concat(recurrings),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const putRecurring = createAsyncThunk(
  'recurrings/putRecurring',
  async (updatedRecurring, { dispatch, getState }) => {
    try {
      const result = await putResourceAPI(updatedRecurring);
      const { data: recurrings } = getState().recurrings;
      if (result) {
        dispatch(setSnackbar({ message: 'recurring updated' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, {
        recurring_id: get(result, 'recurring_id'),
      });
      return {
        data: concat(_recurrings, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deleteRecurring = createAsyncThunk(
  'recurrings/deleteRecurring',
  async (id, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'recurring', id);

      if (result) {
        dispatch(setSnackbar({ message: 'recurring deleted' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, { recurring_id: id });
      return {
        data: _recurrings,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deactivateRecurring = createAsyncThunk(
  'recurrings/deactivateRecurring',
  async (id, { dispatch, getState }) => {
    try {
      const { data: recurrings } = getState().recurrings;
      const { user_id } = getState().user.item;
      const result = processResponse(
        await axios.put(`/recurrings/${user_id}/${id}`, {
          active: false,
        })
      );

      if (result) {
        dispatch(setSnackbar({ message: 'recurring deactivated' }));
      }
      let _recurrings = [...recurrings];
      remove(_recurrings, {
        recurring_id: get(result, 'recurring_id'),
      });
      return {
        data: concat(_recurrings, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'recurrings',
  initialState,
  reducers: {
    setRecurrings: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getRecurrings,
      postRecurring,
      putRecurring,
      deleteRecurring,
      deactivateRecurring,
    ]);
  },
});

const { setRecurrings } = actions;

export {
  postRecurring,
  putRecurring,
  deleteRecurring,
  getRecurrings,
  setRecurrings,
  deactivateRecurring,
};
export default reducer;

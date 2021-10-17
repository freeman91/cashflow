import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { addToastr, types } from '../toastr';
import {
  getRecentHoursAPI,
  postHourAPI,
  putHourAPI,
  deleteHourAPI,
} from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { hours as initialState } from '../initialState';

const postHour = createAsyncThunk(
  'hours/postHour',
  async (new_hour, { dispatch, getState }) => {
    try {
      const result = await postHourAPI(new_hour);
      const { data: hours } = getState().hours;

      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Hour inserted',
          })
        );
      }
      return {
        data: [result].concat(hours),
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

const putHour = createAsyncThunk(
  'hours/putHour',
  async (updatedHour, { dispatch, getState }) => {
    try {
      const result = await putHourAPI(updatedHour);
      const { data: hours } = getState().hours;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Hour updated',
          })
        );
      }
      let _hours = [...hours];
      remove(_hours, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_hours, result),
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

const deleteHour = createAsyncThunk(
  'hours/deleteHour',
  async (id, { dispatch, getState }) => {
    try {
      const result = await deleteHourAPI(id);
      const { data: hours } = getState().hours;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Hour deleted',
          })
        );
      }

      let _hours = [...hours];
      remove(_hours, { _id: id });
      return {
        data: _hours,
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

const getRecentHours = createAsyncThunk('hours/getRecentHours', async () => {
  try {
    const result = await getRecentHoursAPI();
    return {
      data: result,
    };
  } catch (err) {
    console.error(err);
  }
});

const { reducer } = createSlice({
  name: 'hours',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postHour),
    ...thunkReducer(getRecentHours),
    ...thunkReducer(putHour),
    ...thunkReducer(deleteHour),
  },
});

export { postHour, getRecentHours, putHour, deleteHour };
export default reducer;

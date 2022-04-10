import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat, cloneDeep, map, includes } from 'lodash';

import { addToastr, types } from '../toastr';
import { postHourAPI, putHourAPI, deleteHourAPI, getHoursAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { hours as initialState } from '../initialState';
import dayjs from 'dayjs';

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
        id: get(result, 'id'),
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
      remove(_hours, { id: id });
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

const getHours = createAsyncThunk(
  'hours/getHours',
  async (range, { getState }) => {
    try {
      const { data: storeHours } = getState().hours;
      let now = dayjs();
      let start = get(range, 'start');
      let stop = get(range, 'stop');

      if (!start) {
        start = now
          .month(now.month() - 1)
          .day(1)
          .hour(0)
          .minute(0)
          .second(0)
          .unix();
      }

      if (!stop) {
        stop = now
          .day(now.day() + 3)
          .hour(0)
          .minute(0)
          .second(0)
          .unix();
      }

      let allHours = cloneDeep(storeHours);
      const hours = await getHoursAPI(start, stop);
      let updatedHourIds = map(hours, (hour) => hour.id);

      remove(allHours, (hour) => includes(updatedHourIds, hour.id));
      return {
        data: concat(allHours, hours),
      };
    } catch (err) {
      console.error(err);
    }
  }
);

const { reducer } = createSlice({
  name: 'hours',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(postHour),
    ...thunkReducer(getHours),
    ...thunkReducer(putHour),
    ...thunkReducer(deleteHour),
  },
});

export { postHour, getHours, putHour, deleteHour };
export default reducer;

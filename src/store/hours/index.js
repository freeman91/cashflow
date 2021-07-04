import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { addToastr, types } from '../toastr';
import { getRecentHoursAPI, postHourAPI } from '../../api';
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
  },
});

export { postHour, getRecentHours };
export default reducer;

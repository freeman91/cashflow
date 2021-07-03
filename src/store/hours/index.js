import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getRecentHoursAPI, postHourAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { hours as initialState } from '../initialState';

const postHour = createAsyncThunk(
  'hours/postHour',
  async (new_hour, { dispatch, getState }) => {
    try {
      const result = await postHourAPI(new_hour);
      const hours = getState().records.hours;
      return {
        data: hours.append(result),
      };
    } catch (err) {
      console.error(err);
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

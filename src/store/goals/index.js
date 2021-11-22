import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getGoalsAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { goals as initialState } from '../initialState';

const getGoals = createAsyncThunk('goals/getGoals', async () => {
  try {
    return {
      data: await getGoalsAPI(),
    };
  } catch (err) {
    console.error(err);
  }
});

// const putUserSettings = createAsyncThunk(
//   'user/putUserSettings',
//   async (payload) => {
//     try {
//       return await putUserSettingsAPI(payload);
//     } catch (err) {
//       console.error(err);
//     }
//   }
// );

const { reducer } = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getGoals),
  },
});

export { getGoals };
export default reducer;

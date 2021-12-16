import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, remove, concat } from 'lodash';

import { getGoalsAPI, postGoalAPI, putGoalAPI } from '../../api';
import { thunkReducer } from '../thunkTemplate';
import { goals as initialState } from '../initialState';
import { types, addToastr } from '../toastr';

const getGoals = createAsyncThunk('goals/getGoals', async () => {
  try {
    return {
      data: await getGoalsAPI(),
    };
  } catch (err) {
    console.error(err);
  }
});

const postGoal = createAsyncThunk(
  'goals/postGoal',
  async (new_goal, { dispatch, getState }) => {
    try {
      const result = await postGoalAPI(new_goal);
      const { data: goals } = getState().goals;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Goal inserted',
          })
        );
        return {
          data: [result].concat(goals),
        };
      }
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

const putGoal = createAsyncThunk(
  'goals/putGoal',
  async (goal, { dispatch, getState }) => {
    try {
      const result = await putGoalAPI(goal);
      const { data: goals } = getState().goals;
      if (result) {
        dispatch(
          addToastr({
            type: types.success,
            title: 'Success',
            message: 'Goal updated',
          })
        );
      }
      let _goals = [...goals];
      remove(_goals, {
        _id: get(result, '_id'),
      });

      return {
        data: concat(_goals, result),
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
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: {
    ...thunkReducer(getGoals),
    ...thunkReducer(postGoal),
    ...thunkReducer(putGoal),
  },
});

export { getGoals, postGoal, putGoal };
export default reducer;

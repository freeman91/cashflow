export const thunkPending = (state, action) => {
  if (state.loading === false) {
    state.loading = true;
  }
};

export const thunkFulfilled = (state, action) => {
  return {
    ...state,
    ...action.payload,
    loading: false,
  };
};

export const thunkError = (state, action) => {
  if (state.loading === true) {
    state.loading = false;
    state.error = action.error;
  }
};

export const thunkReducer = (asyncThunk) => ({
  [asyncThunk.pending]: thunkPending,
  [asyncThunk.fulfilled]: thunkFulfilled,
  [asyncThunk.rejected]: thunkError,
});

import find from 'lodash/find';
import forEach from 'lodash/forEach';

export const thunkPending = (state, action) => {
  if (state.loading === false) {
    state.loading = true;
    state.currentRequestId = action.meta.requestId;
  }
};

export const thunkFulfilled = (state, action) => {
  return {
    ...state,
    ...action.payload,
    loading: false,
    currentRequestId: undefined,
  };
};

export const thunkError = (state, action) => {
  const { requestId } = action.meta;
  if (state.loading === true && state.currentRequestId === requestId) {
    state.loading = false;
    state.error = action.error;
    state.currentRequestId = undefined;
  }
};

export const thunkReducer = (asyncThunk) => ({
  [asyncThunk.pending]: thunkPending,
  [asyncThunk.fulfilled]: (state, action) => {
    const { requestId } = action.meta;
    if (state.loading === undefined && state.currentRequestId === undefined) {
      return thunkFulfilled(state, action);
    } else if (state.loading === true && state.currentRequestId === requestId) {
      return thunkFulfilled(state, action);
    }
  },
  [asyncThunk.rejected]: thunkError,
});

export const buildAsyncReducers = (builder, reducers) => {
  forEach(reducers, (reducer) => {
    let functions = thunkReducer(reducer);
    const findFunc = (type) =>
      find(functions, (func, key) => key.endsWith(type));

    builder
      .addCase(reducer.fulfilled, findFunc('fulfilled'))
      .addCase(reducer.pending, findFunc('pending'))
      .addCase(reducer.rejected, findFunc('rejected'));
  });
};

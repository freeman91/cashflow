import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { concat, get, remove } from 'lodash';

import axios from '../../api/xhr_libs/axios';
import { deleteResourceAPI, getResourcesAPI, processResponse } from '../../api';
import { buildAsyncReducers } from '../thunkTemplate';
import { items as initialState } from '../initialState';
import { hideLoading, setSnackbar, showLoading } from '../appSettings';

const getSecurities = createAsyncThunk(
  'securities/getSecurities',
  async (user_id, { dispatch }) => {
    try {
      dispatch(showLoading());
      return {
        data: await getResourcesAPI(user_id, 'securities'),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    } finally {
      dispatch(hideLoading());
    }
  }
);

const postSecurity = createAsyncThunk(
  'securities/postSecurity',
  async (newSecurity, { dispatch, getState }) => {
    try {
      const { data: securities } = getState().securities;
      const { user_id } = getState().user.item;
      const result = await processResponse(
        await axios.post(`/securities/${user_id}`, newSecurity)
      );

      if (result) {
        dispatch(setSnackbar({ message: 'security created' }));
      }
      return {
        data: [result].concat(securities),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const putSecurity = createAsyncThunk(
  'securities/putSecurity',
  async (updatedSecurity, { dispatch, getState }) => {
    try {
      const result = await processResponse(
        await axios.put(
          `/securities/${updatedSecurity.user_id}/${updatedSecurity.security_id}`,
          updatedSecurity
        )
      );
      const { data: securities } = getState().securities;
      if (result) {
        dispatch(setSnackbar({ message: 'security updated' }));
      }
      let _securities = [...securities];
      remove(_securities, {
        security_id: get(result, 'security_id'),
      });
      return {
        data: concat(_securities, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deleteSecurity = createAsyncThunk(
  'securities/deleteSecurity',
  async (id, { dispatch, getState }) => {
    try {
      const { data: securities } = getState().securities;
      const { user_id } = getState().user.item;
      const result = await deleteResourceAPI(user_id, 'securitie', id);

      if (result) {
        dispatch(setSnackbar({ message: 'security deleted' }));
      }
      let _securities = [...securities];
      remove(_securities, { security_id: id });
      return {
        data: _securities,
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const deactivateSecurity = createAsyncThunk(
  'securities/deactivateSecurity',
  async (id, { dispatch, getState }) => {
    try {
      const { data: securities } = getState().securities;
      const { user_id } = getState().user.item;
      const result = processResponse(
        await axios.put(`/securities/${user_id}/${id}`, {
          active: false,
        })
      );

      if (result) {
        dispatch(setSnackbar({ message: 'security deactivated' }));
      }
      let _securities = [...securities];
      remove(_securities, {
        security_id: get(result, 'security_id'),
      });
      return {
        data: concat(_securities, result),
      };
    } catch (err) {
      dispatch(setSnackbar({ message: err.message }));
    }
  }
);

const { reducer, actions } = createSlice({
  name: 'securities',
  initialState,
  reducers: {
    setSecurities: (state, action) => {
      state.data = action.payload;
    },
    updateSecurity: (state, action) => {
      const { data: securities } = state;
      let _securities = [...securities];

      const index = _securities.findIndex(
        (security) => security.security_id === action.payload.security_id
      );
      _securities[index] = action.payload;
      state.data = _securities;
    },
  },
  extraReducers: (builder) => {
    buildAsyncReducers(builder, [
      getSecurities,
      postSecurity,
      putSecurity,
      deleteSecurity,
      deactivateSecurity,
    ]);
  },
});

const { setSecurities, updateSecurity } = actions;

export {
  getSecurities,
  putSecurity,
  postSecurity,
  deleteSecurity,
  deactivateSecurity,
  setSecurities,
  updateSecurity,
};
export default reducer;

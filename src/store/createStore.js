import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

/** MIDDLEWARE **/
import thunkMiddleware from 'redux-thunk';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

/** REDUCERS **/
import { reducer as toastr } from 'react-redux-toastr';
import { loadingBarReducer } from 'react-redux-loading-bar';
import accounts from './accounts';
import settings from './settings';
import user from './user';
import expenses from './expenses';
import incomes from './incomes';
import assets from './assets';
import debts from './debts';
import networths from './networths';
import toast from './toastr';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    accounts,
    settings,
    expenses,
    incomes,
    assets,
    debts,
    networths,
    loadingBar: loadingBarReducer,
    router: routerReducer,
    toast,
    toastr,
    user,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(routerMiddleware, thunkMiddleware, loadingBarMiddleware()),
});

export const history = createReduxHistory(store);

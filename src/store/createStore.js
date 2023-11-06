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
import borrows from './borrows';
import dialogs from './dialogs';
import user from './user';
import expenses from './expenses';
import incomes from './incomes';
import bills from './bills';
import assets from './assets';
import debts from './debts';
import networths from './networths';
import optionLists from './optionLists';
import paychecks from './paychecks';
import purchases from './purchases';
import repayments from './repayments';
import sales from './sales';

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    accounts,
    borrows,
    dialogs,
    expenses,
    incomes,
    bills,
    assets,
    debts,
    networths,
    optionLists,
    paychecks,
    purchases,
    repayments,
    sales,
    loadingBar: loadingBarReducer,
    router: routerReducer,
    toastr,
    user,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(routerMiddleware, thunkMiddleware, loadingBarMiddleware()),
});

export const history = createReduxHistory(store);

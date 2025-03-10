import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';

/** MIDDLEWARE **/
import { thunk as thunkMiddleware } from 'redux-thunk';

/** REDUCERS **/
import accounts from './accounts';
import audits from './audits';
import appSettings from './appSettings';
import borrows from './borrows';
import budgets from './budgets';
import categories from './categories';
import user from './user';
import expenses from './expenses';
import histories from './histories';
import incomes from './incomes';
import itemView from './itemView';
import paychecks from './paychecks';
import purchases from './purchases';
import recurrings from './recurrings';
import repayments from './repayments';
import sales from './sales';
import securities from './securities';
const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() });

export const store = configureStore({
  reducer: combineReducers({
    accounts,
    audits,
    appSettings,
    borrows,
    budgets,
    categories,
    expenses,
    incomes,
    itemView,
    histories,
    paychecks,
    purchases,
    recurrings,
    repayments,
    sales,
    securities,
    router: routerReducer,
    user,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(routerMiddleware, thunkMiddleware),
});

export const history = createReduxHistory(store);

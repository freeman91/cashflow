import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

/** MIDDLEWARE **/
import thunkMiddleware from 'redux-thunk';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

/** REDUCERS **/
import { reducer as toastr } from 'react-redux-toastr';
import { loadingBarReducer } from 'react-redux-loading-bar';
import user from './user';
import expenses from './expenses';
import incomes from './incomes';
import hours from './hours';
import assets from './assets';
import debts from './debts';
import networths from './networths';
import toast from './toastr';

export const history = createBrowserHistory();

const loggerColors = {
  title: () => 'inherit',
  prevState: () => '#9E9E9E',
  action: () => '#03A9F4',
  nextState: () => '#4CAF50',
  error: () => '#F20404',
};

const loggerMiddleware = createLogger({
  duration: true, // print the duration of each action?
  timestamp: true, // print the timestamp with each action?
  level: 'log', // console's level
  colors: loggerColors,
  logErrors: true, // should the logger catch, log, and re-throw errors?
  diff: true, // (alpha) show diff between states?
  collapsed: true,
  predicate: (getState, action) => !action.type.includes('progress/continue'),
});

let rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  router: connectRouter(history),
  toast,
  toastr,
  expenses,
  incomes,
  hours,
  assets,
  debts,
  networths,
  user,
});

let middleware = [
  routerMiddleware(history),
  thunkMiddleware,
  loadingBarMiddleware(),
  loggerMiddleware,
];

if (true) middleware.pop();

export default function configureStore(preloadedState) {
  const enhancers = [applyMiddleware(...middleware)];
  const composedEnhancers = composeWithDevTools(...enhancers);
  return createStore(rootReducer, preloadedState, composedEnhancers);
}

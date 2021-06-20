import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

/** MIDDLEWARE **/
import thunkMiddleware from 'redux-thunk';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

/** REDUCERS **/
import user from './user';
import toast from './toastr';
import { reducer as toastr } from 'react-redux-toastr';
import { loadingBarReducer } from 'react-redux-loading-bar';

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
  user,
});

const middleware = [
  routerMiddleware(history),
  thunkMiddleware,
  loadingBarMiddleware(),
  loggerMiddleware,
];

export default function configureStore(preloadedState) {
  const enhancers = [applyMiddleware(...middleware)];
  const composedEnhancers = composeWithDevTools(...enhancers);

  // Create the store
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}

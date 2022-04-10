import React from 'react';
import { useMount } from 'react-use';
import { Helmet } from 'react-helmet';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { v4 as uuidv4 } from 'uuid';

import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import LoadingBar from 'react-redux-loading-bar';

import { ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { muiTheme } from './styles/muiTheme';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import './styles/App.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

import createStore, { history } from './store/createStore';
import { getExpenses } from './store/expenses';
import { getUser } from './store/user';

import Navigation from './routes';
import { getIncomes } from './store/incomes';
import { getHours } from './store/hours';
import { getAssets } from './store/assets';
import { getDebts } from './store/debts';
import { getNetworths } from './store/networths';

let store = createStore();
const useStyles = makeStyles((theme) => ({
  loader: {
    backgroundColor: 'black',
    height: '3px',
    position: 'absolute',
    zIndex: 99999,
  },
}));

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useMount(async () => {
    dispatch(getUser());
    dispatch(getExpenses());
    dispatch(getIncomes());
    dispatch(getHours());
    dispatch(getAssets());
    dispatch(getDebts());
    dispatch(getNetworths());
  });

  return (
    <ConnectedRouter history={history}>
      <LoadingBar className={classes.loader} />
      <Helmet key={uuidv4()}>
        <title>cashflow</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position='bottom-right'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
        progressBar
        closeOnToastrClick
      />
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/dashboard' />
          </Route>
          <Route path='/dashboard' component={Navigation} />
          <Route path='/summary' component={Navigation} />
          <Route path='/networth' component={Navigation} />
          <Route path='/user' component={Navigation} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

function AppProvider() {
  return (
    <ThemeProvider theme={muiTheme}>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <App />
        </LocalizationProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}

export default AppProvider;

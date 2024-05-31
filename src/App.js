import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
import ReduxToastr from 'react-redux-toastr';
import LoadingBar from 'react-redux-loading-bar';

import { styled } from '@mui/material';
import { muiTheme } from './styles/muiTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { history, store } from './store/createStore';

import Layout from './routes/Layout';
import Accounts from './routes/Accounts';
import Dashboard from './routes/Dashboard';
import Month from './components/Calendar/Month';
import Summary from './routes/Summary';
import Networth from './routes/Networth';
import Search from './routes/Search';
import Settings from './routes/Settings';
import './styles/index.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import Assets from './routes/Assets';
import Debts from './routes/Debts';

console.log('_package.version: ', _package.version);

const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
  backgroundColor: theme.palette.blue[500],
  height: '3px',
  position: 'absolute',
  zIndex: 99999,
  top: 0,
}));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/calendar' element={<Month />} />
        <Route path='/summary' element={<Summary />} />
        <Route path='/summary/:year' element={<Summary />} />
        <Route path='/summary/:year/:month' element={<Summary />} />
        <Route path='/networth' element={<Networth />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/:type' element={<Search />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/:option' element={<Settings />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/accounts/:accountId' element={<Accounts />} />
        <Route path='/assets' element={<Assets />} />
        <Route path='/assets/:assetId' element={<Assets />} />
        <Route path='/debts' element={<Debts />} />
        <Route path='/debts/:debtId' element={<Debts />} />
      </Route>
      <Route path='*'>
        <Route index element={<Navigate to='/dashboard' />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <HistoryRouter history={history}>
          <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ReduxLoader />
              <ReduxToastr
                timeOut={10000}
                position='bottom-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'
                progressBar
                preventDuplicates
                closeOnToastrClick
              />
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

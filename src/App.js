import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
import LoadingBar from 'react-redux-loading-bar';

import styled from '@mui/material/styles/styled';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { muiTheme } from './styles/muiTheme';
import { history, store } from './store/createStore';

import Account from './routes/Account';
import Accounts from './routes/Accounts';
import Asset from './routes/Asset';
import Budgets from './routes/Budgets';
import BudgetCategory from './routes/Budgets/Category';
import Calendar from './routes/Calendar';
import Debt from './routes/Debt';
import Home from './routes/Home';
import Layout from './routes/Layout';
import Networth from './routes/Networth';
import Search from './routes/Search';
import Settings from './routes/Settings';
import Summary from './routes/Summary';
import './styles/index.css';

console.log('_package.version: ', _package.version);

const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '3px',
  position: 'absolute',
  zIndex: 99999,
  top: 0,
}));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/account' element={<Account />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/asset' element={<Asset />} />
        <Route path='/budgets' element={<Budgets />} />
        <Route path='/budgets/:category' element={<BudgetCategory />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/calendar/:year/:month' element={<Calendar />} />
        <Route path='/debt' element={<Debt />} />
        <Route path='/summary' element={<Summary />} />
        <Route path='/summary/:year' element={<Summary />} />
        <Route path='/summary/:year/:month' element={<Summary />} />
        <Route path='/networth' element={<Networth />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/:type' element={<Search />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/:type' element={<Settings />} />
        <Route path='/user' element={<></>} />
      </Route>
      <Route path='*'>
        <Route index element={<Navigate to='/home' />} />
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
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

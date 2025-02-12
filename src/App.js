import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { muiTheme } from './styles/muiTheme';
import { history, store } from './store/createStore';

import Accounts from './routes/Accounts';
import Budgets from './routes/Budgets';
import Dashboard from './routes/Dashboard';
import Reports from './routes/Reports';
import Settings from './routes/Settings';
import Transactions from './routes/Transactions';
import Layout from './routes/Layout';
import ReportsViewProvider from './store/contexts/ReportsViewContext';
import './styles/index.css';

console.log('_package.version: ', _package.version);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/accounts/:accountName' element={<Accounts />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/budgets' element={<Budgets />} />
        <Route path='/settings' element={<Settings />} />
        {/* <Route path='/profile' element={<></>} /> */}
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
          <ThemeProvider theme={muiTheme} defaultMode='dark' noSsr>
            <ReportsViewProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='App'>{<AppRoutes />}</div>
              </LocalizationProvider>
            </ReportsViewProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

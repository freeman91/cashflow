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
import Audits from './routes/Audits';
import Budgets from './routes/Budgets';
import Dashboard from './routes/Dashboard';
import Landing from './routes/Landing';
import Reports from './routes/Reports';
import Settings from './routes/Settings';
import Transactions from './routes/Transactions';
import Layout from './routes/Layout';
import './styles/index.css';
import '@ncdai/react-wheel-picker/style.css';

console.log('_package.version: ', _package.version);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/app' element={<Layout />}>
        <Route path='/app/dashboard' element={<Dashboard />} />
        <Route path='/app/accounts' element={<Accounts />} />
        <Route path='/app/accounts/:accountName' element={<Accounts />} />
        <Route path='/app/transactions' element={<Transactions />} />
        <Route path='/app/reports' element={<Reports />} />
        <Route path='/app/reports/:type' element={<Reports />} />
        <Route path='/app/reports/:type/:view' element={<Reports />} />
        <Route path='/app/budgets' element={<Budgets />} />
        <Route path='/app/settings' element={<Settings />} />
        <Route path='/app/audit-log' element={<Audits />} />
        {/* <Route path='/app/profile' element={<></>} /> */}
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

function App() {
  return (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <HistoryRouter history={history}>
          <ThemeProvider theme={muiTheme} defaultMode='dark' noSsr>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

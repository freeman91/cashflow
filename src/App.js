import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
// import LoadingBar from 'react-redux-loading-bar';

// import styled from '@mui/material/styles/styled';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { muiTheme } from './styles/muiTheme';
import { history, store } from './store/createStore';

import Accounts from './routes/Accounts';
import Dashboard from './routes/Dashboard';
import Transactions from './routes/Transactions';
import Recurring from './routes/Recurring';
import Layout from './routes/Layout';
import './styles/index.css';

console.log('_package.version: ', _package.version);

// const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   height: '3px',
//   position: 'absolute',
//   zIndex: 99999,
//   top: 0,
// }));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/accounts/:accountName' element={<Accounts />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/reports' element={<></>} />
        <Route path='/budgets' element={<></>} />
        <Route path='/recurring' element={<Recurring />} />
        {/* <Route path='/settings' element={<></>} /> */}
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
          <ThemeProvider theme={muiTheme} defaultMode='dark'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* <ReduxLoader /> */}
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
import LoadingBar from 'react-redux-loading-bar';

import { styled } from '@mui/material';
import { muiTheme } from './styles/muiTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { history, store } from './store/createStore';

import Layout from './routes/Layout';
import Calendar from './routes/Calendar';
import Dashboard from './routes/Dashboard';
import Settings from './routes/Settings';
import Search from './routes/Search';
import Year from './routes/Year';
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
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/dashboard/:tab' element={<Dashboard />} />
        <Route path='/dashboard/:tab/:subtab' element={<Dashboard />} />
        <Route path='/year' element={<Year />} />
        <Route path='/year/:tab' element={<Year />} />
        <Route path='/search' element={<Search />} />
        <Route path='/search/:type' element={<Search />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/:type' element={<Settings />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/calendar/:year/:month' element={<Calendar />} />
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
              <div className='App'>{<AppRoutes />}</div>
            </LocalizationProvider>
          </ThemeProvider>
        </HistoryRouter>
      </ReduxProvider>
    </React.StrictMode>
  );
}

export default App;

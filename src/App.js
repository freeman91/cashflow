import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HistoryRouter } from 'redux-first-history/rr6';
import LoadingBar from 'react-redux-loading-bar';

import styled from '@mui/material/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import _package from '../package.json';
import { muiTheme } from './styles/muiTheme';
import { history, store } from './store/createStore';

import DesktopAccounts from './routes/Desktop/Accounts';
import DesktopDashboard from './routes/Desktop/Dashboard';
import DesktopTransactions from './routes/Desktop/Transactions';
import DesktopRecurring from './routes/Desktop/Recurring';
import Layout from './routes/Layout';
import MobileAccount from './routes/Mobile/Account';
import MobileAccounts from './routes/Mobile/Accounts';
import MobileAsset from './routes/Mobile/Asset';
import MobileBudgets from './routes/Mobile/Budgets';
import MobileCalendar from './routes/Mobile/Calendar';
import MobileDebt from './routes/Mobile/Debt';
import MobileDashboard from './routes/Mobile/Dashboard';
import MobileNetworth from './routes/Mobile/Networth';
import MobileNetworthSelected from './routes/Mobile/Networth/Selected';
import MobileSearch from './routes/Mobile/Search';
import MobileSettings from './routes/Mobile/Settings';
import MobileSummary from './routes/Mobile/Summary';
import './styles/index.css';

console.log('_package.version: ', _package.version);

const ReduxLoader = styled(LoadingBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '3px',
  position: 'absolute',
  zIndex: 99999,
  top: 0,
}));

const MobileRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<MobileDashboard />} />
        <Route path='/account' element={<MobileAccount />} />
        <Route path='/accounts' element={<MobileAccounts />} />
        <Route path='/accounts/:tab' element={<MobileAccounts />} />
        <Route path='/asset' element={<MobileAsset />} />
        <Route path='/budgets' element={<MobileBudgets />} />
        <Route path='/calendar' element={<MobileCalendar />} />
        <Route path='/calendar/:year/:month' element={<MobileCalendar />} />
        <Route path='/debt' element={<MobileDebt />} />
        <Route path='/summary' element={<MobileSummary />} />
        <Route path='/summary/:year' element={<MobileSummary />} />
        <Route path='/summary/:year/:month' element={<MobileSummary />} />
        <Route path='/networth' element={<MobileNetworth />} />
        <Route path='/networth/:id' element={<MobileNetworthSelected />} />
        <Route path='/search' element={<MobileSearch />} />
        <Route path='/search/:type' element={<MobileSearch />} />
        <Route path='/settings' element={<MobileSettings />} />
        <Route path='/settings/:type' element={<MobileSettings />} />
        <Route path='/user' element={<></>} />
      </Route>
      <Route path='*'>
        <Route index element={<Navigate to='/dashboard' />} />
      </Route>
    </Routes>
  );
};

const DesktopRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<DesktopDashboard />} />
        <Route path='/accounts' element={<DesktopAccounts />} />
        <Route path='/accounts/:accountName' element={<DesktopAccounts />} />
        <Route path='/transactions' element={<DesktopTransactions />} />
        <Route path='/reports' element={<></>} />
        <Route path='/budgets' element={<></>} />
        <Route path='/recurring' element={<DesktopRecurring />} />
        {/* <Route path='/calendar' element={<DesktopCalendar />} /> */}
        {/* <Route path='/calendar/:year/:month' element={<DesktopCalendar />} /> */}
        {/* <Route path='/summary' element={<></>} /> */}
        {/* <Route path='/summary/:year' element={<DesktopSummary />} /> */}
        {/* <Route path='/summary/:year/:month' element={<DesktopSummary />} /> */}
        {/* <Route path='/networth' element={<></>} /> */}
        {/* <Route path='/networth/:id' element={<></>} /> */}
        {/* <Route path='/search' element={<></>} /> */}
        {/* <Route path='/search/:type' element={<></>} /> */}
        {/* <Route path='/settings' element={<></>} /> */}
        {/* <Route path='/settings/:type' element={<></>} /> */}
        {/* <Route path='/user' element={<></>} /> */}
      </Route>
      <Route path='*'>
        <Route index element={<Navigate to='/dashboard' />} />
      </Route>
    </Routes>
  );
};

const AppRoutes = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return isMobile ? <MobileRoutes /> : <DesktopRoutes />;
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

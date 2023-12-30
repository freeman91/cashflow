import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import MainContent from './MainContent';
import AccountDialog from '../../components/Dialog/AccountDialog';
import AssetDialog from '../../components/Dialog/AssetDialog';
import BillDialog from '../../components/Dialog/BillDialog ';
import BorrowDialog from '../../components/Dialog/BorrowDialog';
import DebtDialog from '../../components/Dialog/DebtDialog';
import ExpenseDialog from '../../components/Dialog/ExpenseDialog';
import IncomeDialog from '../../components/Dialog/IncomeDialog';
import NetworthDialog from '../../components/Dialog/NetworthDialog';
import PaycheckDialog from '../../components/Dialog/PaycheckDialog';
import PurchaseDialog from '../../components/Dialog/PurchaseDialog';
import RepaymentDialog from '../../components/Dialog/RepaymentDialog';
import SaleDialog from '../../components/Dialog/SaleDialog';

import { getUser } from '../../store/user';
import AppToolbar from './AppToolbar';
import AppDrawer from './AppDrawer';

const USER_ID = process.env.REACT_APP_USER_ID;

function Layout(props) {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  /* onMount */
  useEffect(() => {
    dispatch(getUser(USER_ID));
    /* eslint-disable-next-line */
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppToolbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <AppDrawer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <MainContent drawerWidth={theme.drawerWidth} />
      <AccountDialog />
      <AssetDialog />
      <BillDialog />
      <BorrowDialog />
      <DebtDialog />
      <ExpenseDialog />
      <IncomeDialog />
      <NetworthDialog />
      <PaycheckDialog />
      <PurchaseDialog />
      <RepaymentDialog />
      <SaleDialog />
    </Box>
  );
}

export default Layout;

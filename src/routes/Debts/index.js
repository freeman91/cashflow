import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import find from 'lodash/find';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';
import DebtsStack from './DebtsStack';
import DebtPage from './DebtPage';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function Debts() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const debts = useSelector((state) => state.debts.data);

  let debtId = location.pathname.replace('/debts', '');
  debtId = debtId.replace('/', '');
  const [debt, setDebt] = useState(null);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: (
          <Stack spacing={1} direction='row'>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/accounts'))}>
                <AccountBalanceIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton onClick={() => dispatch(push('/assets'))}>
                <AccountBalanceWalletIcon />
              </IconButton>
            </Card>
          </Stack>
        ),
      })
    );
  }, [dispatch, debt]);

  useEffect(() => {
    if (debtId) {
      let _debt = find(debts, { debt_id: debtId });
      setDebt(_debt);
      setDebtSum(0);
    } else {
      setDebt(null);
      setDebtSum(reduce(debts, (sum, debt) => sum + debt.amount, 0));
    }
  }, [debts, debtId]);

  const renderComponent = () => {
    if (debtId) {
      return <DebtPage debt={debt} />;
    }
    return <DebtsStack />;
  };

  if (debtId && !debt) return null;
  return (
    <Grid container spacing={1} mb={10}>
      {!debt && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              background: `linear-gradient(0deg, ${theme.palette.surface[300]}, ${theme.palette.surface[400]})`,
              width: '100%',
              py: 1,
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <BoxFlexCenter>
              <Typography variant='h4' color='grey.10'>
                $
              </Typography>
              <Typography variant='h4' color='white' fontWeight='bold'>
                {_numberToCurrency.format(debtSum)}
              </Typography>
            </BoxFlexCenter>
            <Typography variant='body2' align='center' color='grey.10'>
              debt total
            </Typography>
          </Box>
        </Grid>
      )}
      {renderComponent()}
    </Grid>
  );
}

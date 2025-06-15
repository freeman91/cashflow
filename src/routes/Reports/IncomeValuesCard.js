import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../helpers/currency';
import IncomeSummary from './IncomeSummary';
import {
  findAmount,
  findPaycheckContributionSum,
} from '../../helpers/transactions';

export default function IncomeValuesCard(props) {
  const {
    date,
    earnedIncomes,
    passiveIncomes,
    otherIncomes,
    showPending = true,
  } = props;
  const theme = useTheme();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pendingIncomeSum, setPendingIncomeSum] = useState(0);
  const [pendingPaycheckSum, setPendingPaycheckSum] = useState(0);

  useEffect(() => {
    if (!showPending) {
      setPendingIncomeSum(0);
      setPendingPaycheckSum(0);
      return;
    }

    const pendingIncomes = allIncomes.filter((income) => {
      return date.isSame(income.date, 'month') && income.pending;
    });
    const pendingPaychecks = allPaychecks.filter((paycheck) => {
      return date.isSame(paycheck.date, 'month') && paycheck.pending;
    });

    let incomeSum = 0;
    for (const income of pendingIncomes) {
      incomeSum += findAmount(income);
    }

    let paycheckSum = 0;
    for (const paycheck of pendingPaychecks) {
      paycheckSum += findAmount(paycheck);
      paycheckSum += findPaycheckContributionSum(paycheck, 'employee');
      paycheckSum += findPaycheckContributionSum(paycheck, 'employer');
    }

    setPendingIncomeSum(incomeSum);
    setPendingPaycheckSum(paycheckSum);
  }, [allIncomes, allPaychecks, date, showPending]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'summary-popover' : undefined;
  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const pendingTotal = showPending ? pendingIncomeSum + pendingPaycheckSum : 0;
  return (
    <Grid size={{ md: 4, xs: pendingTotal > 0 ? 12 : 6 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[24],
          },
        }}
        onClick={handleClick}
      >
        <Typography color='textSecondary' variant='h6'>
          Income
        </Typography>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography
            fontWeight='bold'
            variant='h5'
            sx={{ color: theme.palette.success.main }}
          >
            {numberToCurrency.format(totalIncome)}
          </Typography>
          {pendingTotal > 0 && <Typography variant='h5'>|</Typography>}
          {pendingTotal > 0 && (
            <Typography variant='h5' sx={{ color: theme.palette.warning.main }}>
              {numberToCurrency.format(pendingTotal)}
            </Typography>
          )}
        </Box>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <IncomeSummary
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Popover>
    </Grid>
  );
}

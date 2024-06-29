import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getPaychecks } from '../../store/paychecks';
import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import BoxFlexColumn from '../../components/BoxFlexColumn';

const CustomIconButton = (props) => {
  const { color, orientation, children } = props;
  const theme = useTheme();
  const deg = orientation === 'left' ? '-45deg' : '45deg';
  return (
    <IconButton
      sx={{
        color: (theme) => color,
        background: `linear-gradient(${deg}, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
        boxShadow: 6,
        borderRadius: '5px',
        p: '4px',
      }}
    >
      {children}
    </IconButton>
  );
};

const BoxCurrencyDisplay = (props) => {
  const { value, label, color, icon, orientation } = props;
  const theme = useTheme();

  const deg = orientation === 'left' ? '15deg' : '-15deg';
  return (
    <Box
      sx={{
        position: 'relative',
        width: 175,
        height: 75,
        background: `linear-gradient(${deg}, ${theme.palette.surface[300]}, ${theme.palette.surface[500]})`,
        boxShadow: 6,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        mt: 2,
        pl: orientation === 'left' ? 2 : 1,
        pr: orientation === 'right' ? 2 : 1,
      }}
    >
      {orientation === 'right' && (
        <CustomIconButton color={color}>{icon}</CustomIconButton>
      )}

      <BoxFlexColumn
        alignItems={orientation === 'left' ? 'flex-start' : 'flex-end'}
      >
        <Typography variant='body2' color='grey.0'>
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h5' color='grey.10'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
      {orientation === 'left' && (
        <CustomIconButton color={color}>{icon}</CustomIconButton>
      )}
    </Box>
  );
};

export default function Cashflow() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [date] = useState(dayjs().hour(12).minute(0));
  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

  useEffect(() => {
    let start = date.startOf('month');
    let end = date.endOf('month');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  }, [dispatch, date]);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      return dayjs(income.date).isSame(date, 'month');
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      return dayjs(paycheck.date).isSame(date, 'month');
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [date, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      return dayjs(expense.date).isSame(date, 'month') && !expense.pending;
    });

    let repayments = filter(allRepayments, (repayment) => {
      return dayjs(repayment.date).isSame(date, 'month') && !repayment.pending;
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    total += reduce(
      repayments,
      (sum, repayment) =>
        sum + repayment.interest + (repayment.escrow ? repayment.escrow : 0),
      0
    );

    setExpenseSum(total);
    setPrincipalSum(
      reduce(repayments, (sum, repayment) => sum + repayment.principal, 0)
    );
  }, [date, allExpenses, allRepayments]);

  const net = incomeSum - expenseSum - principalSum;

  return (
    <Grid item xs={12} m={1}>
      <Box
        sx={{
          background: `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]} 75%)`,
          height: 140,
          width: '100%',
          pt: 2,
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BoxFlexCenter>
          {net < 0 && (
            <Typography variant='h4' color='grey.10'>
              -
            </Typography>
          )}
          <Typography variant='h4' color='grey.10'>
            $
          </Typography>
          <Typography variant='h4' color='white' fontWeight='bold'>
            {_numberToCurrency.format(Math.abs(net))}
          </Typography>
        </BoxFlexCenter>
        <Typography variant='body2' align='center' color='grey.10'>
          {date.format('MMMM') + ' cashflow'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <BoxCurrencyDisplay
            value={incomeSum}
            label='earned'
            color={theme.palette.green[400]}
            icon={<TrendingUpIcon />}
            orientation='left'
          />
          <BoxCurrencyDisplay
            value={expenseSum + principalSum}
            label='spent'
            color={theme.palette.red[400]}
            icon={<TrendingDownIcon />}
            orientation='right'
          />
        </Box>
      </Box>
    </Grid>
  );
}

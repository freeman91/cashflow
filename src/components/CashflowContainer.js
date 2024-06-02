import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../helpers/currency';
import { getExpenses } from '../store/expenses';
import { getIncomes } from '../store/incomes';
import { getPaychecks } from '../store/paychecks';

dayjs.extend(advancedFormat);
const BORDER_RADIUS = '2px';

export default function CashflowContainer(props) {
  const { month, year } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);

  const [upperBound, setUpperBound] = useState(100);

  useEffect(() => {
    let start = dayjs().year(year).startOf('year');
    let end = dayjs().year(year).endOf('year');

    if (month) {
      start = dayjs()
        .year(year)
        .month(month - 1)
        .startOf('month');
      end = dayjs()
        .year(year)
        .month(month - 1)
        .endOf('month');
    }

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      const tDate = dayjs(income.date);
      return (
        tDate.year() === year && (month ? tDate.month() === month - 1 : true)
      );
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      const tDate = dayjs(paycheck.date);
      return (
        tDate.year() === year && (month ? tDate.month() === month - 1 : true)
      );
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [year, month, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        (month ? tDate.month() === month - 1 : true) &&
        !expense.pending
      );
    });

    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        (month ? tDate.month() === month - 1 : true) &&
        !repayment.pending
      );
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
  }, [year, month, allExpenses, allRepayments]);

  useEffect(() => {
    let maxValue = Math.max(incomeSum, expenseSum + principalSum);
    setUpperBound(Math.ceil(maxValue / 100) * 100);
  }, [incomeSum, expenseSum, principalSum]);

  return (
    <CardContent sx={{ p: 1, pt: 0, pb: '8px !important' }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        sx={{ alignItems: 'center' }}
      >
        <List disablePadding sx={{ width: '50%' }}>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='earned' />
            <ListItemText primary={numberToCurrency.format(incomeSum)} />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <Box
              sx={{
                backgroundColor: theme.palette.green[600],
                height: 10,
                width: `${(incomeSum / upperBound) * 100}%`,
                borderRadius: BORDER_RADIUS,
              }}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='spent' />
            <ListItemText
              primary={'-' + numberToCurrency.format(expenseSum + principalSum)}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <Tooltip
              title={
                <ListItem disablePadding disableGutters>
                  <ListItemText
                    primary='expenses'
                    primaryTypographyProps={{ variant: 'body2' }}
                    sx={{ m: 0, mr: 1, p: 0 }}
                  />
                  <ListItemText
                    sx={{ p: 0, m: 0 }}
                    primary={'-' + numberToCurrency.format(expenseSum)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      align: 'right',
                      fontWeight: 800,
                    }}
                  />
                </ListItem>
              }
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.red[600],
                  height: 10,
                  width: `${(expenseSum / upperBound) * 100}%`,
                  borderBottomLeftRadius: BORDER_RADIUS,
                  borderTopLeftRadius: BORDER_RADIUS,
                }}
              />
            </Tooltip>
            <Tooltip
              title={
                <ListItem disablePadding disableGutters>
                  <ListItemText
                    primary='principal'
                    primaryTypographyProps={{ variant: 'body2' }}
                    sx={{ m: 0, mr: 1, p: 0 }}
                  />
                  <ListItemText
                    sx={{ p: 0, m: 0 }}
                    primary={'-' + numberToCurrency.format(principalSum)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      align: 'right',
                      fontWeight: 800,
                    }}
                  />
                </ListItem>
              }
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.red[400],
                  height: 10,
                  width: `${(principalSum / upperBound) * 100}%`,
                  borderBottomRightRadius: BORDER_RADIUS,
                  borderTopRightRadius: BORDER_RADIUS,
                }}
              />
            </Tooltip>
          </ListItem>
        </List>
        <Typography
          variant='h4'
          color={
            incomeSum > expenseSum + principalSum
              ? theme.palette.green[600]
              : theme.palette.red[600]
          }
        >
          {numberToCurrency.format(incomeSum - expenseSum - principalSum)}
        </Typography>
      </Stack>
    </CardContent>
  );
}

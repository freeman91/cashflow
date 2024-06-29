import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import { useTheme } from '@emotion/react';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getPaychecks } from '../../store/paychecks';

dayjs.extend(advancedFormat);

export default function CashflowExpandedContainer(props) {
  const { month, year } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [incomeSum, setIncomeSum] = useState(0);
  const [paycheckSum, setPaycheckSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);

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
    let incomes = filter(allIncomes, (income) => {
      const tDate = dayjs(income.date);
      return (
        tDate.year() === year && (month ? tDate.month() === month - 1 : true)
      );
    });
    setIncomeSum(reduce(incomes, (sum, income) => sum + income.amount, 0));
  }, [year, month, allIncomes]);

  useEffect(() => {
    let paychecks = filter(allPaychecks, (paycheck) => {
      const tDate = dayjs(paycheck.date);
      return (
        tDate.year() === year && (month ? tDate.month() === month - 1 : true)
      );
    });
    setPaycheckSum(
      reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0)
    );
  }, [year, month, allPaychecks]);

  useEffect(() => {
    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        (month ? tDate.month() === month - 1 : true) &&
        !repayment.pending
      );
    });

    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        (month ? tDate.month() === month - 1 : true) &&
        !expense.pending
      );
    });

    let _expenseSum = 0;
    _expenseSum += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    _expenseSum += reduce(
      repayments,
      (sum, repayment) => sum + (repayment.escrow ? repayment.escrow : 0),
      0
    );
    setExpenseSum(_expenseSum);
    setPrincipalSum(
      reduce(repayments, (sum, repayment) => sum + repayment.principal, 0)
    );
    setInterestSum(
      reduce(repayments, (sum, repayment) => sum + repayment.interest, 0)
    );
  }, [year, month, allExpenses, allRepayments]);

  return (
    <CardContent sx={{ p: 1, pt: 1, pb: '0px !important' }}>
      <Typography
        align='center'
        variant='h4'
        color={
          incomeSum + paycheckSum > expenseSum + principalSum + interestSum
            ? theme.palette.success.main
            : theme.palette.danger.main
        }
      >
        {numberToCurrency.format(
          incomeSum + paycheckSum - expenseSum - principalSum - interestSum
        )}
      </Typography>
      <Stack
        direction='row'
        justifyContent='space-between'
        sx={{ alignItems: 'flex-start' }}
      >
        <List disablePadding sx={{ width: '50%' }}>
          <ListItem disableGutters disablePadding>
            <ListItemText
              sx={{ width: '30%' }}
              secondary='earned'
              secondaryTypographyProps={{ fontWeight: 'bold' }}
            />
            <ListItemText
              primary={numberToCurrency.format(incomeSum + paycheckSum)}
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='paychecks' />
            <ListItemText primary={numberToCurrency.format(paycheckSum)} />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='other' />
            <ListItemText primary={numberToCurrency.format(incomeSum)} />
          </ListItem>
        </List>
        <List disablePadding sx={{ width: '50%' }}>
          <ListItem disableGutters disablePadding>
            <ListItemText
              sx={{ width: '30%' }}
              secondary='spent'
              secondaryTypographyProps={{ fontWeight: 'bold' }}
            />
            <ListItemText
              primary={numberToCurrency.format(
                expenseSum + principalSum + interestSum
              )}
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          <Divider />
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='expenses' />
            <ListItemText primary={numberToCurrency.format(expenseSum)} />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='principal' />
            <ListItemText primary={numberToCurrency.format(principalSum)} />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='interest' />
            <ListItemText primary={numberToCurrency.format(interestSum)} />
          </ListItem>
        </List>
      </Stack>
    </CardContent>
  );
}

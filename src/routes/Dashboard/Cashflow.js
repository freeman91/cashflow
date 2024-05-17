import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { numberToCurrency } from '../../helpers/currency';
import { getExpenses } from '../../store/expenses';
import { getIncomes } from '../../store/incomes';
import { getPaychecks } from '../../store/paychecks';

export default function Cashflow({ month, setMonth }) {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);
  const allNetworths = useSelector((state) => state.networths.data);

  const [incomeSum, setIncomeSum] = useState(0);
  const [expenseSum, setExpenseSum] = useState(0);
  const [assetSum, setAssetSum] = useState(0);
  const [debtSum, setDebtSum] = useState(0);

  useEffect(() => {
    let total = 0;
    let incomes = filter(allIncomes, (income) => {
      const date = dayjs(income.date);
      return date.year() === month.year() && date.month() === month.month();
    });
    let paychecks = filter(allPaychecks, (paycheck) => {
      const date = dayjs(paycheck.date);
      return date.year() === month.year() && date.month() === month.month();
    });

    total += reduce(incomes, (sum, income) => sum + income.amount, 0);
    total += reduce(paychecks, (sum, paycheck) => sum + paycheck.take_home, 0);
    setIncomeSum(total);
  }, [month, allIncomes, allPaychecks]);

  useEffect(() => {
    let total = 0;
    let expenses = filter(allExpenses, (expense) => {
      const date = dayjs(expense.date);
      return (
        date.year() === month.year() &&
        date.month() === month.month() &&
        !expense.pending
      );
    });

    let repayments = filter(allRepayments, (repayment) => {
      const date = dayjs(repayment.date);
      return (
        date.year() === month.year() &&
        date.month() === month.month() &&
        !repayment.pending
      );
    });

    total += reduce(expenses, (sum, expense) => sum + expense.amount, 0);
    total += reduce(
      repayments,
      (sum, repayment) =>
        sum +
        repayment.principal +
        repayment.interest +
        (repayment.escrow ? repayment.escrow : 0),
      0
    );

    setExpenseSum(total);
  }, [month, allExpenses, allRepayments]);

  useEffect(() => {
    const today = dayjs();
    if (today.isSame(month, 'month')) {
      setAssetSum(reduce(allAssets, (sum, asset) => sum + asset.value, 0));
      setDebtSum(reduce(allDebts, (sum, debt) => sum + debt.amount, 0));
    } else {
      const networth = find(allNetworths, (networth) => {
        const date = dayjs(networth.date);
        return date.isSame(month, 'month');
      });
      setAssetSum(
        reduce(networth.assets, (sum, asset) => sum + asset.value, 0)
      );
      setDebtSum(reduce(networth.debts, (sum, debt) => sum + debt.value, 0));
    }
  }, [month, allAssets, allDebts, allNetworths]);

  const handleDateSelect = (e) => {
    setMonth(e);

    const start = e.startOf('month');
    const end = e.endOf('month');
    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));
  };

  return (
    <Card raised sx={{ height: '100%' }}>
      <CardContent sx={{ pt: 1, pb: '4px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <IconButton
            sx={{ height: 30, width: 30 }}
            onClick={() => {
              let date = month.date(15).subtract(1, 'month');
              handleDateSelect(date);
            }}
          >
            <ArrowBackIos />
          </IconButton>
          <DatePicker
            views={['year', 'month']}
            maxDate={dayjs().add(1, 'month')}
            minDate={dayjs('2018-01-01')}
            value={month}
            onChange={handleDateSelect}
            slotProps={{
              textField: {
                variant: 'standard',
                inputProps: {
                  readOnly: true,
                },
              },
            }}
          />
          <IconButton
            sx={{ height: 30, width: 30 }}
            onClick={() => {
              let date = month.date(15).add(1, 'month');
              handleDateSelect(date);
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        <Divider sx={{ mt: 1, mb: 1 }} />

        <Stack direction='row' justifyContent='space-between' spacing={2}>
          <List disablePadding sx={{ width: '100%' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText primary='income' />
              <ListItemText
                primary={numberToCurrency.format(incomeSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText primary='expenses' />
              <ListItemText
                primary={numberToCurrency.format(expenseSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemText primary='net' />
              <ListItemText
                primary={numberToCurrency.format(incomeSum - expenseSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
          </List>

          <Divider orientation='vertical' flexItem />

          <List disablePadding sx={{ width: '100%' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText primary='assets' />
              <ListItemText
                primary={numberToCurrency.format(assetSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText primary='debts' />
              <ListItemText
                primary={numberToCurrency.format(debtSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemText primary='net worth' />
              <ListItemText
                primary={numberToCurrency.format(assetSum - debtSum)}
                primaryTypographyProps={{ align: 'right', fontWeight: 800 }}
              />
            </ListItem>
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}

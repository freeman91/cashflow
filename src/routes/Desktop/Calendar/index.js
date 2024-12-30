import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import MonthContent from '../../Mobile/Calendar/MonthContent';
import SelectedTransactionsStack from '../../Mobile/Calendar/SelectedTransactionsStack';
import useExpenses from '../../../store/hooks/useExpenses';
import useIncomes from '../../../store/hooks/useIncomes';
import PullToRefresh from '../../../components/PullToRefresh';
import MonthSelectButton from '../../../components/MonthSelectButton';
import TransactionsTable from '../Home/Transactions/Table';

export default function Calendar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const today = dayjs();

  const [month, setMonth] = useState(dayjs());
  const [days, setDays] = useState([]);

  const { expenses, pendingExpenses } = useExpenses(
    month.year(),
    month.month()
  );
  const { incomes } = useIncomes(month.year(), month.month());

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showWeights] = useState(true);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (location?.state?.month) {
      setMonth(dayjs(location?.state?.month['$d']));
    }
  }, [location.state]);

  useEffect(() => {
    let firstDayOfMonth = month.date(1).hour(12).minute(0).second(0);
    let firstDayOfWeek = firstDayOfMonth.day(0).hour(12).minute(0).second(0);

    let _days = [];
    let currentDay = firstDayOfWeek;

    while (currentDay.isBefore(firstDayOfMonth, 'month')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    while (currentDay.isSame(firstDayOfMonth, 'month')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    let lastDayOfMonth = currentDay.subtract(1, 'day');
    while (currentDay.isSame(lastDayOfMonth, 'week')) {
      _days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    setDays(_days);
  }, [month]);

  useEffect(() => {
    let transactions = filter(
      [...expenses, ...pendingExpenses, ...incomes],
      (transaction) => {
        return dayjs(transaction.date).isSame(month, 'day');
      }
    );

    setSelectedTransactions(transactions);
  }, [month, expenses, pendingExpenses, incomes]);

  const handlePrevMonth = () => {
    const previousMonth = month?.subtract(1, 'month');
    setMonth(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = month?.add(1, 'month');
    setMonth(nextMonth);
  };

  const diff = today.diff(month, 'month');
  const format = diff > 10 ? 'MMMM YYYY' : 'MMMM';

  return (
    <Grid
      container
      spacing={1}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ maxWidth: 1000, mx: 'auto', width: '100%', mt: 1 }}
    >
      <PullToRefresh onRefresh={onRefresh} />
      <Grid item xs={12} display='flex' justifyContent='center'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            py: 1,
          }}
        >
          <MonthSelectButton Icon={ChevronLeftIcon} onClick={handlePrevMonth} />
          <Typography variant='h5' fontWeight='bold'>
            {month?.format(format)}
          </Typography>
          <MonthSelectButton
            Icon={ChevronRightIcon}
            onClick={handleNextMonth}
          />
        </Box>
      </Grid>

      <MonthContent
        selectedDate={month}
        setSelectedDate={setMonth}
        days={days}
        monthExpenses={[...expenses, ...pendingExpenses]}
        monthIncomes={incomes}
        showWeights={showWeights}
      />
      <TransactionsTable transactions={selectedTransactions} showDate={false} />
      <Grid item xs={12} mb={10} />
    </Grid>
  );
}

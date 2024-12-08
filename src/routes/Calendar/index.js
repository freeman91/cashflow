import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MonthContent from './MonthContent';
import SelectedTransactionsStack from './SelectedTransactionsStack';
import useExpenses from '../../store/hooks/useExpenses';
import useIncomes from '../../store/hooks/useIncomes';
import CustomAppBar from '../../components/CustomAppBar';

export default function Calendar() {
  const location = useLocation();
  const today = dayjs();
  const theme = useTheme();

  const [month, setMonth] = useState(dayjs());
  const [days, setDays] = useState([]);

  const { expenses, pendingExpenses } = useExpenses(
    month.year(),
    month.month()
  );
  const { incomes } = useIncomes(month.year(), month.month());

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showWeights] = useState(true);

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
  const lightColor = alpha(theme.palette.primary.main, 0.2);
  return (
    <Box sx={{ height: '100%', width: '100%', mb: 8 }}>
      <CustomAppBar
        right={
          <IconButton size='medium'>
            <FilterAltIcon sx={{ color: 'button' }} />
          </IconButton>
        }
      />
      <Box sx={{ height: '42px', pt: 1 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          py: 2,
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: lightColor,
          }}
        >
          <IconButton size='large' onClick={handlePrevMonth} sx={{ p: 0.75 }}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Typography variant='h5' fontWeight='bold' color='primary'>
          {month?.format(format)}
        </Typography>
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: lightColor,
          }}
        >
          <IconButton size='large' onClick={handleNextMonth} sx={{ p: 0.75 }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <MonthContent
        selectedDate={month}
        setSelectedDate={setMonth}
        days={days}
        monthExpenses={[...expenses, ...pendingExpenses]}
        monthIncomes={incomes}
        showWeights={showWeights}
      />
      <SelectedTransactionsStack transactions={selectedTransactions} />
    </Box>
  );
}

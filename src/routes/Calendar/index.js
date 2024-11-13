import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MonthContent from './MonthContent';
import SelectedTransactionsStack from './SelectedTransactionsStack';
import CustomAppBar from '../../components/CustomAppBar';
import useExpenses from '../../store/hooks/useExpenses';
import useIncomes from '../../store/hooks/useIncomes';

export default function Calendar() {
  const location = useLocation();
  const toolbarRef = useRef(null);
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

  const marginTop = toolbarRef?.current?.offsetHeight || 90;
  const diff = today.diff(month, 'month');
  const format = diff > 10 ? 'MMMM YYYY' : 'MMMM';
  return (
    <Box sx={{ height: '100%', width: '100%', mb: 8, maxWidth: 600 }}>
      <CustomAppBar
        ref={toolbarRef}
        title={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconButton size='large' onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant='h6'>{month?.format(format)}</Typography>
            <IconButton size='large' onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        }
      />
      <Box sx={{ height: marginTop + 'px', pt: 1 }} />
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

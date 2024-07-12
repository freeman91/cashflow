import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MonthContent from './MonthContent';
import SelectedTransactionsStack from './SelectedTransactionsStack';
import { setAppBar } from '../../store/appSettings';
import { BackButton, SettingsButton } from '../Layout/CustomAppBar';
import { push } from 'redux-first-history';

export default function Calendar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [date, selectedDate] = useState(null);
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showWeights] = useState(true);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: <SettingsButton />,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const today = dayjs();
    const year = get(location.pathname.split('/'), '2', today.year());
    const month = get(location.pathname.split('/'), '3', today.month() + 1);

    selectedDate(
      dayjs()
        .year(year)
        .month(month - 1)
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!date) return;
    let firstDayOfMonth = date.date(1).hour(12).minute(0).second(0);
    let firstDayOfWeek = firstDayOfMonth.day(0).hour(12).minute(0).second(0);

    const filterRecords = (records) => {
      return filter(records, (record) => {
        const expDay = dayjs(record.date);
        const BOM = firstDayOfWeek.hour(0);
        const EOM = date.endOf('month').day(6).hour(23);
        return (
          (expDay.isAfter(BOM, 'day') || expDay.isSame(BOM, 'day')) &&
          (expDay.isBefore(EOM, 'day') || expDay.isSame(EOM, 'day'))
        );
      });
    };

    setMonthExpenses(filterRecords([...allExpenses, ...allRepayments]));
    setMonthIncomes(filterRecords([...allIncomes, ...allPaychecks]));

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
  }, [date, allExpenses, allIncomes, allRepayments, allPaychecks]);

  useEffect(() => {
    let expenses = filter(monthExpenses, (expense) => {
      return dayjs(expense.date).isSame(date, 'day');
    });
    let incomes = filter(monthIncomes, (income) => {
      return dayjs(income.date).isSame(date, 'day');
    });
    setSelectedTransactions([...expenses, ...incomes]);
  }, [date, monthExpenses, monthIncomes]);

  const handlePreviousMonth = () => {
    const previousMonth = date?.subtract(1, 'month');
    dispatch(
      push(`/calendar/${previousMonth.year()}/${previousMonth.month() + 1}`)
    );
  };

  const handleNextMonth = () => {
    const nextMonth = date?.add(1, 'month');
    dispatch(push(`/calendar/${nextMonth.year()}/${nextMonth.month() + 1}`));
  };

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Box sx={{ background: (theme) => theme.palette.surface[250] }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <IconButton onClick={() => handlePreviousMonth()}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant='h6'>{date?.format('MMMM YYYY')}</Typography>
          <IconButton onClick={() => handleNextMonth()}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Box>
      <MonthContent
        selectedDate={date}
        setSelectedDate={selectedDate}
        days={days}
        monthExpenses={monthExpenses}
        monthIncomes={monthIncomes}
        showWeights={showWeights}
      />
      <SelectedTransactionsStack transactions={selectedTransactions} />
    </Box>
  );
}

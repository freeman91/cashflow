import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
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

export default function Calendar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const toolbarRef = useRef(null);
  const today = dayjs();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [month, setMonth] = useState(dayjs());
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showWeights] = useState(true);

  useEffect(() => {
    if (location?.state?.month) {
      setMonth(dayjs(location?.state?.month['$d']));
    }
  }, [location.state]);

  useEffect(() => {
    if (!month) return;
    let firstDayOfMonth = month.date(1).hour(12).minute(0).second(0);
    let firstDayOfWeek = firstDayOfMonth.day(0).hour(12).minute(0).second(0);

    const filterRecords = (records) => {
      return filter(records, (record) => {
        const expDay = dayjs(record.date);
        const BOM = firstDayOfWeek.hour(0);
        const EOM = month.endOf('month').day(6).hour(23);
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
  }, [month, allExpenses, allIncomes, allRepayments, allPaychecks]);

  useEffect(() => {
    let expenses = filter(monthExpenses, (expense) => {
      return dayjs(expense.date).isSame(month, 'day');
    });
    let incomes = filter(monthIncomes, (income) => {
      return dayjs(income.date).isSame(month, 'day');
    });
    setSelectedTransactions([...expenses, ...incomes]);
  }, [month, monthExpenses, monthIncomes]);

  const handlePrevMonth = () => {
    const previousMonth = month?.subtract(1, 'month');
    dispatch(
      push(`/calendar/${previousMonth.year()}/${previousMonth.month() + 1}`)
    );
  };

  const handleNextMonth = () => {
    const nextMonth = month?.add(1, 'month');
    dispatch(push(`/calendar/${nextMonth.year()}/${nextMonth.month() + 1}`));
  };

  const marginTop = toolbarRef?.current?.offsetHeight || 90;
  const diff = today.diff(month, 'month');
  const format = diff > 10 ? 'MMMM YYYY' : 'MMMM';
  const nextDisabled = today.isSameOrBefore(month, 'month');

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
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
            <IconButton
              size='large'
              onClick={handleNextMonth}
              disabled={nextDisabled}
            >
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
        monthExpenses={monthExpenses}
        monthIncomes={monthIncomes}
        showWeights={showWeights}
      />
      <SelectedTransactionsStack transactions={selectedTransactions} />
    </Box>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep, filter, map, range } from 'lodash';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Day from '../Day';
import MonthYearSelector from '../../Selector/MonthYearSelector';
import { getExpenses } from '../../../store/expenses';
import { getIncomes } from '../../../store/incomes';
import { getPaychecks } from '../../../store/paychecks';
import SelectedTransactions from './SelectedTransactionsTable';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function Month() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  useEffect(() => {
    let firstDayOfMonth = selectedDate.date(1).hour(12).minute(0).second(0);
    let firstDayOfWeek = firstDayOfMonth.day(0).hour(12).minute(0).second(0);

    const filterRecords = (records) => {
      return filter(records, (record) => {
        const expDay = dayjs(record.date);
        const BOM = firstDayOfWeek.hour(0);
        const EOM = selectedDate.endOf('month').day(6).hour(23);
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
  }, [selectedDate, allExpenses, allIncomes, allRepayments, allPaychecks]);

  useEffect(() => {
    let expenses = filter(monthExpenses, (expense) => {
      return dayjs(expense.date).isSame(selectedDate, 'day');
    });
    let incomes = filter(monthIncomes, (income) => {
      return dayjs(income.date).isSame(selectedDate, 'day');
    });
    setSelectedTransactions([...expenses, ...incomes]);
  }, [selectedDate, monthExpenses, monthIncomes]);

  const handleDateChange = (newDate) => {
    const start = newDate.startOf('month');
    const end = newDate.endOf('month');

    dispatch(getExpenses({ range: { start, end } }));
    dispatch(getIncomes({ range: { start, end } }));
    dispatch(getPaychecks({ range: { start, end } }));

    setSelectedDate(newDate);
  };

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

    let week = 1;
    weeks.push(
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        key={`week-day-letter`}
        spacing={1}
        sx={{ backgroundColor: (theme) => theme.palette.background.light }}
      >
        {map(range(7), (idx) => {
          return (
            <Typography
              key={idx}
              align='center'
              sx={{ width: '14%' }}
              variant='body2'
            >
              {daysOfWeek[idx]}
            </Typography>
          );
        })}
      </Stack>
    );

    while (_days.length > 0) {
      weeks.push(
        <Divider
          key={`divider-${week}`}
          sx={{ borderColor: (theme) => theme.palette.grey[700] }}
        />
      );
      weeks.push(
        <Stack
          key={`week-stack-${week}`}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
          pt={0.5}
          pb={0.5}
        >
          {map(range(7), (idx) => {
            let _day = _days.shift();

            let expenses = filter(monthExpenses, (expense) => {
              return dayjs(expense.date).isSame(_day, 'day');
            });
            let incomes = filter(monthIncomes, (income) => {
              return dayjs(income.date).isSame(_day, 'day');
            });

            return (
              <Day
                key={`day-${_day.format('YYYY-MM-DD')}`}
                date={_day}
                selectedDate={selectedDate}
                expenses={expenses}
                incomes={incomes}
                onClick={() => setSelectedDate(_day)}
              />
            );
          })}
        </Stack>
      );
      week = week + 1;
    }
    return weeks;
  };

  return (
    <div style={{ marginTop: 8, margin: 8 }}>
      <Card raised sx={{ mb: 1 }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          key={`month-year-picker-stack`}
          spacing={1}
        >
          <IconButton
            onClick={() => handleDateChange(selectedDate.subtract(1, 'month'))}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <MonthYearSelector
            date={selectedDate}
            handleDateChange={(newDate) => {
              handleDateChange(newDate);
            }}
            interval='month'
          />
          <IconButton
            disabled={selectedDate.isSame(dayjs().add(1, 'month'), 'month')}
            onClick={() => handleDateChange(selectedDate.add(1, 'month'))}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Stack>
      </Card>
      <Card raised>{renderWeeks()}</Card>

      <SelectedTransactions selectedTransactions={selectedTransactions} />
    </div>
  );
}

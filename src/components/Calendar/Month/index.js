import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep, filter, map, range } from 'lodash';
import dayjs from 'dayjs';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import Day from '../Day';
import MonthYearSelector from '../../Selector/MonthYearSelector';
import { getExpenses } from '../../../store/expenses';
import { getIncomes } from '../../../store/incomes';
import { getPaychecks } from '../../../store/paychecks';

export default function Month() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.item);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [date, setDate] = useState(
    dayjs().date(15).hour(12).minute(0).second(0)
  );
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);

  useEffect(() => {
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

  const handleDateChange = (newDate) => {
    const start = newDate.date(1).hour(0);
    const end = newDate.add(1, 'month').date(1).hour(0);

    dispatch(getExpenses({ user_id: user.user_id, range: { start, end } }));
    dispatch(getIncomes({ user_id: user.user_id, range: { start, end } }));
    dispatch(getPaychecks({ user_id: user.user_id, range: { start, end } }));

    setDate(newDate);
  };

  const renderWeeks = () => {
    let weeks = [];
    let _days = cloneDeep(days);

    let week = 1;
    while (_days.length > 0) {
      weeks.push(
        <Stack
          direction='row'
          justifyContent='center'
          alignItems='center'
          key={`week-stack-${week}`}
          spacing={1}
          pb={1}
        >
          {map(range(7), () => {
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
                sameMonth={_day.isSame(date, 'month')}
                expenses={expenses}
                incomes={incomes}
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
    <div style={{ marginTop: 8 }}>
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        key={`month-year-picker-stack`}
        spacing={1}
        pb={1}
      >
        <IconButton onClick={() => handleDateChange(date.subtract(1, 'month'))}>
          <ArrowBackIosIcon />
        </IconButton>
        <MonthYearSelector
          date={date}
          handleDateChange={(newDate) => {
            handleDateChange(newDate);
          }}
          interval='month'
        />
        <IconButton
          disabled={date.isSame(dayjs().add(1, 'month'), 'month')}
          onClick={() => handleDateChange(date.add(1, 'month'))}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
      {renderWeeks()}
    </div>
  );
}

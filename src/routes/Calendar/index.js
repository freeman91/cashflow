import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import MonthContent from './MonthContent';
import SelectedTransactions from './SelectedTransactionsTable';

export default function Calendar() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [days, setDays] = useState([]);
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [monthIncomes, setMonthIncomes] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showWeights] = useState(true);

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

  return (
    <>
      <MonthContent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        days={days}
        monthExpenses={monthExpenses}
        monthIncomes={monthIncomes}
        showWeights={showWeights}
      />
      <SelectedTransactions transactions={selectedTransactions} />
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { filter, forEach } from 'lodash';

import { getRecentExpenses } from '../../store/expenses';
import { getRecentIncomes } from '../../store/incomes';
import { getRecentHours } from '../../store/hours';

import RecentRecordsTable from '../../components/Table/RecentRecordsTable';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const { data: expenses } = useSelector((state) => state.expenses);
  const { data: incomes } = useSelector((state) => state.incomes);
  const { data: hours } = useSelector((state) => state.hours);
  const [filterExpense, setFilterExpense] = useState(false);
  const [filterIncome, setFilterIncome] = useState(false);
  const [filterHour, setFilterHour] = useState(false);

  useEffect(() => {
    dispatch(getRecentExpenses());
    dispatch(getRecentIncomes());
    dispatch(getRecentHours());
  }, [dispatch]);

  useEffect(() => {
    const prepareRecentRecords = () => {
      var _expenses = filterExpense ? [] : expenses;
      var _incomes = filterIncome ? [] : incomes;
      var _hours = filterHour ? [] : hours;

      let records = [];
      let days = [];
      for (var i = 0; i <= 7; i++) {
        days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
      }

      forEach(days, (day) => {
        let dayRecords = [];
        let dayExpenses = filter(_expenses, (expense) => {
          return expense.date === day;
        });
        let dayIncomes = filter(_incomes, (income) => {
          return income.date === day;
        });
        let dayHours = filter(_hours, (hour) => {
          return hour.date === day;
        });

        dayRecords = dayRecords
          .concat(dayExpenses)
          .concat(dayIncomes)
          .concat(dayHours);

        records = records.concat(dayRecords);
      });
      return records.slice(0, 10);
    };

    setTableData(prepareRecentRecords(expenses, incomes, hours));
  }, [expenses, incomes, hours, filterExpense, filterIncome, filterHour]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <RecentRecordsTable
          data={tableData}
          filterExpense={filterExpense}
          setFilterExpense={setFilterExpense}
          filterIncome={filterIncome}
          setFilterIncome={setFilterIncome}
          filterHour={filterHour}
          setFilterHour={setFilterHour}
        />
      </Grid>
    </Grid>
  );
}

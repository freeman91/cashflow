import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
// import { filter } from 'lodash';

import { Grid } from '@mui/material';

// import { getExpensesAPI, getIncomesAPI, getHoursAPI } from '../../api';

import RecordSummaryTable from '../../components/Table/RecordSummaryTable';
import SummaryTotalsContainer from '../../components/containers/SummaryTotalsContainer';

const defaultRange = [
  dayjs().date(1).hour(0),
  dayjs().add(1, 'month').date(0).hour(23),
];

export default function Summary() {
  const [tableData, setTableData] = useState([]);
  const [filterExpense, setFilterExpense] = useState(false);
  const [filterIncome, setFilterIncome] = useState(false);
  const [filterHour, setFilterHour] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [hours, setHours] = useState([]);
  const [range, setRange] = useState(defaultRange);

  // const prepareData = useCallback(
  //   (expenses, incomes, hours) => {
  //     var _expenses = filterExpense ? [] : expenses;
  //     var _incomes = filterIncome ? [] : incomes;
  //     var _hours = filterHour ? [] : hours;

  //     let records = [];
  //     var _day = range[0];
  //     while (_day <= range[1]) {
  //       let dayRecords = [];
  //       const dayStr = _day.format('YYYY-MM-DD');
  //       let dayExpenses = filter(_expenses, (expense) => {
  //         return expense.date === dayStr;
  //       });
  //       let dayIncomes = filter(_incomes, (income) => {
  //         return income.date === dayStr;
  //       });
  //       let dayHours = filter(_hours, (hour) => {
  //         return hour.date === dayStr;
  //       });
  //       dayRecords = dayRecords
  //         .concat(dayExpenses)
  //         .concat(dayIncomes)
  //         .concat(dayHours);
  //       dayRecords = dayRecords.map((record, i) => {
  //         if (i === 0) return { ...record };
  //         return record;
  //       });
  //       records = records.concat(dayRecords);
  //       _day = _day.add(1, 'day');
  //     }
  //     setTableData(records);
  //     setExpenses(_expenses);
  //     setIncomes(_incomes);
  //     setHours(_hours);
  //   },
  //   [filterExpense, filterHour, filterIncome, range]
  // );

  const getRecords = useCallback(async () => {
    // const start = range[0].unix();
    // const end = range[1].unix();
    // Promise.all([
    //   getExpensesAPI(start, end),
    //   getIncomesAPI(start, end),
    //   getHoursAPI(start, end),
    // ]).then(([expenses, incomes, hours]) => {
    //   prepareData(expenses, incomes, hours);
    // });
  }, []);

  useEffect(() => {
    getRecords();
  }, [getRecords]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SummaryTotalsContainer
          expenses={expenses}
          incomes={incomes}
          hours={hours}
          filterExpense={filterExpense}
          filterIncome={filterIncome}
          filterHour={filterHour}
        />
      </Grid>
      <Grid item xs={12}>
        <RecordSummaryTable
          data={tableData}
          range={range || defaultRange}
          setRange={setRange}
          filterExpense={filterExpense}
          setFilterExpense={setFilterExpense}
          filterIncome={filterIncome}
          setFilterIncome={setFilterIncome}
          filterHour={filterHour}
          setFilterHour={setFilterHour}
          refresh={getRecords}
        />
      </Grid>
    </Grid>
  );
}

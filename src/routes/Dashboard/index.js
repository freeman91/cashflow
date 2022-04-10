import React from 'react';
import { Grid } from '@mui/material';

export default function Dashboard() {
  // useEffect(() => {
  //   const prepareRecentRecords = () => {
  //     var _expenses = filterExpense ? [] : expenses;
  //     var _incomes = filterIncome ? [] : incomes;
  //     var _hours = filterHour ? [] : hours;

  //     let records = [];
  //     let days = [];
  //     for (var i = 0; i <= 7; i++) {
  //       days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  //     }

  //     forEach(days, (day) => {
  //       let dayRecords = [];
  //       let dayExpenses = filter(_expenses, (expense) => {
  //         return expense.date === day;
  //       });
  //       let dayIncomes = filter(_incomes, (income) => {
  //         return income.date === day;
  //       });
  //       let dayHours = filter(_hours, (hour) => {
  //         return hour.date === day;
  //       });

  //       dayRecords = dayRecords
  //         .concat(dayExpenses)
  //         .concat(dayIncomes)
  //         .concat(dayHours);

  //       records = records.concat(dayRecords);
  //     });
  //     return records.slice(0, 10);
  //   };

  //   setTableData(prepareRecentRecords(expenses, incomes, hours));
  // }, [expenses, incomes, hours, filterExpense, filterIncome, filterHour]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}></Grid>
    </Grid>
  );
}

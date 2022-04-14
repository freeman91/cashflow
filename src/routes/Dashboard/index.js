import React from 'react';
import { useSelector } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';

export default function Dashboard() {
  const expenses = useSelector((state) => state.expenses.data);
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

  console.log('expenses: ', expenses);

  const columns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'vendor', headerName: 'Vendor', width: 150 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={expenses}
            columns={columns}
            pageSize={30}
            rowsPerPageOptions={[30]}
            // checkboxSelection
            // disableSelectionOnClick
          />
        </div>
      </Grid>
    </Grid>
  );
}

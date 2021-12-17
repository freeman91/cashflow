import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { filter } from 'lodash';

import { Box, TextField, Toolbar, Typography } from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';

import RecordTable from './RecordTable';
import GenerateRecordButton from '../../components/Button/GenerateRecordButton';
import FilterRecordsButton from '../Button/FilterRecordsButton';

export default function RecordSummaryTable(props) {
  const {
    data,
    range,
    setRange,
    filterExpense,
    setFilterExpense,
    filterIncome,
    setFilterIncome,
    filterHour,
    setFilterHour,
  } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(
      filter(data, (row) => {
        if (
          (row.category === 'expense' && filterExpense) ||
          (row.category === 'income' && filterIncome) ||
          (row.category === 'hour' && filterHour)
        ) {
          return false;
        }
        return true;
      })
    );
  }, [data, filterExpense, filterIncome, filterHour]);

  return (
    <>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='left' variant='h4'>
          Transactions
        </Typography>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <DateRangePicker
            startText='start'
            endText='end'
            value={range}
            onChange={(val) => {
              setRange([dayjs(val[0]).hour(0), dayjs(val[1]).hour(23)]);
            }}
            renderInput={(startProps, endProps) => {
              return (
                <>
                  <TextField
                    {...startProps}
                    sx={{ width: 100 }}
                    InputProps={{
                      sx: { height: 30 },
                    }}
                  />
                  <Box sx={{ mx: 2 }}> - </Box>
                  <TextField
                    {...endProps}
                    sx={{ width: 100, mr: 5 }}
                    InputProps={{
                      sx: { height: 30 },
                    }}
                  />
                </>
              );
            }}
          />
          <div style={{ margin: -5 }}>
            <FilterRecordsButton
              filterExpense={filterExpense}
              setFilterExpense={setFilterExpense}
              filterIncome={filterIncome}
              setFilterIncome={setFilterIncome}
              filterHour={filterHour}
              setFilterHour={setFilterHour}
            />
            <GenerateRecordButton />
          </div>
        </div>
      </Toolbar>
      <RecordTable data={tableData} />
    </>
  );
}

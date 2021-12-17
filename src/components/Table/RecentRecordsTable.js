import React from 'react';
import dayjs from 'dayjs';

import { Toolbar, Typography } from '@mui/material';

import GenerateRecordButton from '../../components/Button/GenerateRecordButton';
import FilterRecordsButton from '../Button/FilterRecordsButton';
import RecordTable from './RecordTable';

export default function RecentRecordsTable({
  data,
  filterExpense,
  setFilterExpense,
  filterIncome,
  setFilterIncome,
  filterHour,
  setFilterHour,
}) {
  return (
    <>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='right' variant='h4'>
          {dayjs().format('dddd, MMMM D YYYY')}
        </Typography>
        <div>
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
      </Toolbar>
      <RecordTable data={data} />
    </>
  );
}

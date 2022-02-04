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
    refresh,
  } = props;
  const [tableData, setTableData] = useState([]);
  const [selectedRange, setSelectedRange] = useState(range);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      !range[0].isSame(selectedRange[0], 'day') &&
      !range[1].isSame(selectedRange[1], 'day')
    ) {
      if (selectedRange[1] > selectedRange[0]) {
        setRange(selectedRange);
        setOpen(false);
      }
    }
  }, [selectedRange, range, setRange]);

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

  const handleDateFieldClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='left' variant='h4'>
          Transactions
        </Typography>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <DateRangePicker
            open={open}
            calendars={1}
            startText='start'
            endText='end'
            value={selectedRange}
            onChange={(val) => {
              setSelectedRange([dayjs(val[0]).hour(0), dayjs(val[1]).hour(23)]);
            }}
            renderInput={(startProps, endProps) => {
              return (
                <>
                  <TextField
                    {...startProps}
                    onClick={handleDateFieldClick}
                    sx={{ width: 100 }}
                    InputProps={{
                      sx: { height: 30 },
                    }}
                  />
                  <Box sx={{ mx: 2 }}> - </Box>
                  <TextField
                    {...endProps}
                    onClick={handleDateFieldClick}
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
            <GenerateRecordButton refresh={refresh} />
          </div>
        </div>
      </Toolbar>
      <RecordTable data={tableData} />
    </>
  );
}

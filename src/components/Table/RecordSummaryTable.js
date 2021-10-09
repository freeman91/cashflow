import React, { useState } from 'react';
import { useUpdateEffect, useMeasure } from 'react-use';
import dayjs from 'dayjs';

import {
  Box,
  Card,
  CardContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import {
  SortingState,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  PagingPanel,
  Table,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

import GenerateRecordButton from '../../components/Button/GenerateRecordButton';
import { TableComponent } from './TableComponent';
import { CellComponent } from './CellComponent';
import { AmountTypeProvider, DateTypeProvider } from '../Table/Providers';
import { SourceVendorTypeProvider } from './Providers/SourceVendorTypeProvider';
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
  const [columns] = useState([
    { title: 'Date', name: 'date' },
    { title: 'Amount', name: 'amount' },
    { title: 'Category', name: 'category' },
    { title: 'Source', name: 'source' },
    { title: 'Description', name: 'description' },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: 'date', width: 180 },
    { columnName: 'amount', width: 180 },
    { columnName: 'category', width: 180 },
    { columnName: 'source', width: 180 },
    { columnName: 'description', width: 180 },
  ]);
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [tableRef, { width }] = useMeasure();

  useUpdateEffect(() => {
    if (width) {
      const availableWidth = width; // the edit/delete button groups
      setColumnWidths([
        { columnName: 'date', width: availableWidth * 0.2 },
        { columnName: 'amount', width: availableWidth * 0.2 },
        { columnName: 'category', width: availableWidth * 0.2 },
        { columnName: 'source', width: availableWidth * 0.2 },
        { columnName: 'description', width: availableWidth * 0.2 },
      ]);
    }
  }, [width]);

  return (
    <Card>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='right' variant='h4'>
          Transaction History
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
      <CardContent>
        <div ref={tableRef}>
          <Grid rows={data} columns={columns}>
            <AmountTypeProvider for={['amount']} />
            <DateTypeProvider for={['date']} data={data} />
            <SourceVendorTypeProvider for={['source']} />
            <SortingState
              defaultSorting={[{ columnName: 'date', direction: 'desc' }]}
            />
            <PagingState defaultCurrentPage={0} defaultPageSize={10} />
            <IntegratedPaging />
            <PagingPanel />

            <Table
              tableComponent={TableComponent}
              cellComponent={CellComponent}
            />

            <TableColumnResizing
              columnWidths={columnWidths}
              onColumnWidthsChange={setColumnWidths}
              resizingMode='nextColumn'
            />
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
}

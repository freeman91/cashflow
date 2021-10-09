import React, { useEffect, useState } from 'react';
import { useUpdateEffect, useMeasure } from 'react-use';
import { reduce } from 'lodash';

import { Card, CardContent, Toolbar, Typography } from '@mui/material';
import { SortingState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

import { TableComponent } from './TableComponent';
import { CellComponent } from './CellComponent';
import { AmountTypeProvider } from '../Table/Providers';

const prepareStats = (expenses, incomes, hours) => {
  return [
    {
      name: 'expense sum',
      amount: reduce(
        expenses,
        (sum, expense) => {
          return sum + expense.amount;
        },
        0
      ),
      category: 'expense',
    },
    {
      name: 'incomes sum',
      amount: reduce(
        incomes,
        (sum, income) => {
          return sum + income.amount;
        },
        0
      ),
      category: 'income',
    },
    {
      name: 'hour sum',
      amount: reduce(
        hours,
        (sum, hour) => {
          return sum + hour.amount;
        },
        0
      ),
      category: 'hour',
    },
  ];
};

export default function SummaryTotalTable(props) {
  const { expenses, incomes, hours } = props;
  const [tableData, setTableData] = useState([]);
  const [columns] = useState([
    { title: 'Name', name: 'name' },
    { title: 'Amount', name: 'amount' },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: 'name', width: 180 },
    { columnName: 'amount', width: 180 },
  ]);
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [tableRef, { width }] = useMeasure();

  useUpdateEffect(() => {
    if (width) {
      const availableWidth = width; // the edit/delete button groups
      setColumnWidths([
        { columnName: 'name', width: availableWidth * 0.5 },
        { columnName: 'amount', width: availableWidth * 0.5 },
      ]);
    }
  }, [width]);

  useEffect(() => {
    let _tableData = prepareStats(expenses, incomes, hours);
    setTableData(_tableData);
  }, [expenses, incomes, hours]);

  return (
    <Card>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='right' variant='h4'>
          Totals
        </Typography>
      </Toolbar>
      <CardContent>
        <div ref={tableRef}>
          <Grid rows={tableData} columns={columns}>
            <AmountTypeProvider for={['amount']} />
            <SortingState
              defaultSorting={[{ columnName: 'date', direction: 'desc' }]}
            />

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

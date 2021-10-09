import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateEffect, useMeasure } from 'react-use';
import dayjs from 'dayjs';
import { get, reduce } from 'lodash';

import {
  Card,
  CardContent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

import { RowDetailState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableColumnResizing,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';

import { ToggleCell } from './ToggleCell';
import { TableComponent } from './TableComponent';
import { CellComponent } from './CellComponent';
import { AmountTypeProvider } from './Providers';
import AssetDetailTable from './AssetDetailTable';
import DebtDetailTable from './DebtDetailTable';

const NetWorthRowDetail = ({ row }) => {
  if (row) {
    let assets = get(row, 'assets');
    let debts = get(row, 'debts');
    if (assets) {
      return <AssetDetailTable rows={assets} />;
    } else if (debts) {
      return <DebtDetailTable rows={debts} />;
    }
  } else {
    return <Typography>No Data</Typography>;
  }
};

export default function NetWorthTable() {
  // const { data: networths } = useSelector((state) => state.networths);
  const { data: assets } = useSelector((state) => state.assets);
  const { data: debts } = useSelector((state) => state.debts);
  const [tableData, setTableData] = useState([]);
  const [date, setDate] = useState(dayjs().subtract(1, 'month'));
  const [columns] = useState([
    { title: 'Name', name: 'name' },
    { title: 'Amount', name: 'amount' },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: 'name', width: 180 },
    { columnName: 'amount', width: 180 },
  ]);
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [tableRef, { width }] = useMeasure();

  useUpdateEffect(() => {
    if (width) {
      const availableWidth = width - 48;
      setColumnWidths([
        { columnName: 'name', width: availableWidth * 0.5 },
        { columnName: 'amount', width: availableWidth * 0.5 },
      ]);
    }
  }, [width]);

  useEffect(() => {
    let assetSum = reduce(
      assets,
      (sum, asset) => {
        return sum + get(asset, 'value', 0);
      },
      0
    );
    let debtSum = reduce(
      debts,
      (sum, debt) => {
        return sum + get(debt, 'value', 0);
      },
      0
    );
    setTableData([
      { name: 'Net Worth', amount: assetSum - debtSum },
      { name: 'Asset Sum', amount: assetSum, assets },
      { name: 'Debt Sum', amount: -debtSum, debts },
    ]);
  }, [assets, debts]);

  return (
    <Card>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography align='right' variant='h4'>
          Net Worth
        </Typography>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <DatePicker
            views={['year', 'month']}
            label='Year and Month'
            minDate={new Date('2018-11-01')}
            maxDate={new Date('2030-12-31')}
            value={date}
            onChange={(date) => {
              setDate(date);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth helperText={null} />
            )}
          />
        </div>
      </Toolbar>
      <CardContent>
        <div ref={tableRef}>
          <Grid rows={tableData} columns={columns}>
            <AmountTypeProvider for={['amount']} />
            <RowDetailState
              expandedRowIds={expandedRowIds}
              onExpandedRowIdsChange={setExpandedRowIds}
            />
            <Table
              tableComponent={TableComponent}
              cellComponent={CellComponent}
            />
            <TableRowDetail
              contentComponent={NetWorthRowDetail}
              cellComponent={CellComponent}
              toggleCellComponent={(props) => (
                <ToggleCell
                  {...props}
                  expandTooltip='Show Devices'
                  collapseTooltip='Hide Devices'
                />
              )}
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

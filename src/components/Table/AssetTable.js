import React, { useState } from 'react';
import { useUpdateEffect, useMeasure } from 'react-use';

import {
  Grid,
  Table,
  TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';

import { TableComponent } from './TableComponent';
import { CellComponent } from './CellComponent';
import { AmountTypeProvider, DateTypeProvider } from './Providers';

export default function AssetTable(props) {
  const { rows } = props;
  const [columns] = useState([
    { title: 'Amount', name: 'value' },
    { title: 'Name', name: 'name' },
    { title: 'Last Update', name: 'last_update' },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: 'value', width: 180 },
    { columnName: 'name', width: 180 },
    { columnName: 'last_update', width: 180 },
  ]);
  const [columnWidths, setColumnWidths] = useState(defaultColumnWidths);
  const [tableRef, { width }] = useMeasure();

  useUpdateEffect(() => {
    if (width) {
      const availableWidth = width;
      setColumnWidths([
        { columnName: 'value', width: availableWidth * 0.3333 },
        { columnName: 'name', width: availableWidth * 0.3333 },
        { columnName: 'last_update', width: availableWidth * 0.3333 },
      ]);
    }
  }, [width]);

  return (
    <div ref={tableRef}>
      <Grid rows={rows} columns={columns}>
        <AmountTypeProvider for={['value']} />
        <DateTypeProvider for={['last_update']} />

        <Table tableComponent={TableComponent} cellComponent={CellComponent} />

        <TableColumnResizing
          columnWidths={columnWidths}
          onColumnWidthsChange={setColumnWidths}
          resizingMode='nextColumn'
        />
      </Grid>
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { numberToCurrency } from '../../helpers/currency';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export default function ExpensesTable() {
  const expenses = useSelector((state) => state.expenses.data);
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 125,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('MMMM, Do')}</Typography>
        );
      },
    },

    {
      field: 'type',
      headerName: 'Type',
      minWidth: 175,
      flex: 1,
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      align: 'right',
      headerAlign: 'right',
      minWidth: 175,
      flex: 1,
      renderCell: (params) => {
        return <Typography>{numberToCurrency.format(params.value)}</Typography>;
      },
    },
  ];

  const handleRowClick = (e) => {
    console.log('e: ', e);
  };

  return (
    <div
      style={{
        height: '28.4rem',
        width: '100%',
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }}
    >
      <DataGrid
        sx={{
          '& .MuiDataGrid-virtualScrollerRenderZone': {
            '& .MuiDataGrid-row': {
              '&:nth-of-type(2n)': {
                backgroundColor: '#222222',
              },
            },
          },
        }}
        isRowSelectable={() => false}
        rows={expenses}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
        }}
        onRowClick={handleRowClick}
        density='compact'
      />
    </div>
  );
}

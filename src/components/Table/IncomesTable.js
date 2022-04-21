import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import { numberToCurrency } from '../../helpers/currency';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export default function IncomesTable() {
  const incomes = useSelector((state) => state.incomes.data);
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography>{dayjs(params.value).format('MMMM, Do')}</Typography>
        );
      },
    },

    { field: 'type', headerName: 'Type', minWidth: 150, flex: 1 },
    { field: 'source', headerName: 'Source', minWidth: 150, flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 150,
      flex: 1,
      align: 'right',
      headerAlign: 'right',
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
        height: '12.6rem',
        width: '100%',
        paddingLeft: '10rem',
        paddingRight: '10rem',
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
        rows={incomes}
        columns={columns}
        pageSize={3}
        rowsPerPageOptions={[3]}
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

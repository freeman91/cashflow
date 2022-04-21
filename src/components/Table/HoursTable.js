import React from 'react';
import { useSelector } from 'react-redux';
import numeral from 'numeral';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export default function HoursTable() {
  const hours = useSelector((state) => state.hours.data);
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

    { field: 'source', headerName: 'Source', minWidth: 150, flex: 1 },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 150,
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        return (
          <Typography>
            {numeral(params.value.toPrecision(2)).format('0,0.[00]')}
          </Typography>
        );
      },
    },
  ];

  const handleRowClick = (e) => {
    console.log('e: ', e);
  };

  return (
    <div
      style={{
        height: '17.1rem',
        width: '100%',
        paddingLeft: '15rem',
        paddingRight: '15rem',
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
        rows={hours}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
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

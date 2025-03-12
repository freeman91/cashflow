import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import { DataGrid } from '@mui/x-data-grid';

import { getAudits } from '../../store/audits';

export default function Audits() {
  const dispatch = useDispatch();
  const audits = useSelector((state) => state.audits.data);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dispatch(getAudits());
  }, [dispatch]);

  useEffect(() => {
    setRows(
      audits.map((audit, idx) => ({
        id: idx,
        timestamp: audit.timestamp,
        status: audit.status,
        user_id: audit.user_id,
        action: audit.action,
        message: audit.message,
      }))
    );
  }, [audits]);

  const columns = [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 160,
      renderCell: (params) => {
        return dayjs(params.row.timestamp).format('MMM Do, YYYY HH:mm');
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 60,
      renderCell: (params) => {
        return params.row.status === 'success' ? '✅' : '❌';
      },
    },
    {
      field: 'user_id',
      headerName: 'User ID',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
    },
  ];

  const handleRowClick = (params) => {
    alert(params.row.message);
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        pb: 6,
      }}
    >
      <Grid size={{ xs: 12 }} sx={{ width: '100%', mr: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Grid>
    </Grid>
  );
}

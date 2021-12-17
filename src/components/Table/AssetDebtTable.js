import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  TableCell,
  TablePagination,
} from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';
import { setDialog } from '../../store/settings';

export default function AssetDebtTable({ rows }) {
  const tableHeaderCellStyle = { fontWeight: 800, width: '10rem' };
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = (row) => {
    dispatch(setDialog({ open: true, record: row }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={tableHeaderCellStyle}>
                Name
              </TableCell>
              <TableCell align='left' sx={tableHeaderCellStyle}>
                Type
              </TableCell>
              <TableCell align='left' sx={tableHeaderCellStyle}>
                Value
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * 10, page * 10 + 10).map((row) => (
              <TableRow key={row._id} onClick={() => handleClick(row)}>
                <TableCell align='left'>{row.name}</TableCell>
                <TableCell align='left'>{row.type}</TableCell>
                <TableCell align='left'>
                  {numberToCurrency.format(row.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length <= 10 ? null : (
        <TablePagination
          rowsPerPageOptions={[10]}
          component='div'
          count={rows.length}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </>
  );
}

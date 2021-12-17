import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from '@mui/material';
import numeral from 'numeral';

import { numberToCurrency } from '../../helpers/currency';

export default function RecordTable({ data }) {
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderAmount = (row) => {
    if (row.category !== 'hour') {
      return numberToCurrency.format(row.amount);
    } else {
      return numeral(row.amount.toPrecision(2)).format('0,0.[00]');
    }
  };

  const tableHeaderCellStyle = { fontWeight: 800, width: '10rem' };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={tableHeaderCellStyle}>
                Date
              </TableCell>
              <TableCell align='right' sx={tableHeaderCellStyle}>
                Amount
              </TableCell>
              <TableCell align='right' sx={tableHeaderCellStyle}>
                Category
              </TableCell>
              <TableCell align='right' sx={tableHeaderCellStyle}>
                Source
              </TableCell>
              <TableCell align='right' sx={tableHeaderCellStyle}>
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * 10, page * 10 + 10).map((row) => (
              <TableRow key={row._id} onClick={() => console.log(row)}>
                <TableCell component='th' scope='row'>
                  {dayjs(row.date).format('MMMM D')}
                </TableCell>
                <TableCell align='right'>{renderAmount(row)}</TableCell>
                <TableCell align='right'>{row.category}</TableCell>
                <TableCell align='right'>{row.source}</TableCell>
                <TableCell align='right'>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length <= 10 ? null : (
        <TablePagination
          rowsPerPageOptions={[10]}
          component='div'
          count={data.length}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      )}
    </>
  );
}

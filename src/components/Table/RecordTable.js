import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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

import { setDialog } from '../../store/settings';
import { numberToCurrency } from '../../helpers/currency';

const tableHeaderCellStyle = { fontWeight: 800, width: '10rem' };

const renderAmount = (row) => {
  if (row.category !== 'hour') {
    return numberToCurrency.format(row.amount);
  } else {
    return numeral(row.amount.toPrecision(2)).format('0,0.[00]');
  }
};

export default function RecordTable({ data }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClick = (row) => {
    dispatch(setDialog({ open: true, record: row }));
  };

  useEffect(() => {
    let maxPage = Math.max([Math.ceil(data.length / 10) - 1], 0);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [data, page]);

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
                Source/Vendor
              </TableCell>
              <TableCell align='right' sx={tableHeaderCellStyle}>
                Description
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * 10, page * 10 + 10).map((row) => (
              <TableRow key={row._id} onClick={() => handleClick(row)}>
                <TableCell component='th' scope='row'>
                  {dayjs(row.date).format('MMMM D')}
                </TableCell>
                <TableCell align='right'>{renderAmount(row)}</TableCell>
                <TableCell align='right'>{row.category}</TableCell>
                <TableCell align='right'>
                  {row.category === 'expense' ? row.vendor : row.source}
                </TableCell>
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

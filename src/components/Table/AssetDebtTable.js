import React from 'react';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableContainer,
  TableCell,
} from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

export default function AssetDebtTable({ rows }) {
  const tableHeaderCellStyle = { fontWeight: 800, width: '10rem' };

  return (
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
          {rows.map((row) => (
            <TableRow key={row._id} onClick={() => console.log(row)}>
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
  );
}

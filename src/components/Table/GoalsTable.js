import React from 'react';
import { get } from 'lodash';
import {
  Paper,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

export default function GoalsTable({ items }) {
  const handleCellClick = (e) => {
    let item = e.target.textContent;
    console.log('item: ', item);
  };

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid grey' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Goal</TableCell>
            <TableCell align='right'>Actual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={get(item, 'category')} hover>
              <TableCell component='th' scope='row' onClick={handleCellClick}>
                {get(item, 'category')}
              </TableCell>
              <TableCell component='th' scope='row' onClick={handleCellClick}>
                {numberToCurrency.format(get(item, 'goal'))}
              </TableCell>
              <TableCell scope='row' onClick={handleCellClick} align='right'>
                {numberToCurrency.format(get(item, 'actual'))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

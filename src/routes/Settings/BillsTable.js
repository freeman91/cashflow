import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { map, sortBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../store/dialogs';
import { numberToCurrency } from '../../helpers/currency';

export default function BillsTable() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.data);

  const handleClick = (bill) => {
    dispatch(openDialog({ mode: 'update', attrs: bill }));
  };

  return (
    <TableContainer sx={{ mt: 2, maxWidth: 500 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>name</TableCell>
            <TableCell>type</TableCell>
            <TableCell>vendor</TableCell>
            <TableCell>amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(sortBy(bills, 'name'), (bill) => {
            return (
              <TableRow
                hover={true}
                key={bill.id}
                onClick={() => handleClick(bill)}
              >
                <TableCell sx={{ fontWeight: 800 }}>{bill.name}</TableCell>
                <TableCell>{bill.type}</TableCell>
                <TableCell>{bill.vendor}</TableCell>
                <TableCell>{numberToCurrency.format(bill.amount)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

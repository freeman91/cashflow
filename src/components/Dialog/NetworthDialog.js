import React from 'react';
import { useSelector } from 'react-redux';
import { find, get, reduce } from 'lodash';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Divider,
} from '@mui/material';

import { months } from '../../helpers/monthNames';
import { numberToCurrency } from '../../helpers/currency';

export default function NetworthDialog({ open, handleClose, selectedMonth }) {
  const { data: networths } = useSelector((state) => state.networths);
  let [month, year] = selectedMonth.split('-');

  let selectedNetworth = find(networths, {
    month: Number(month),
    year: Number(year),
  });

  let assets = get(selectedNetworth, 'assets', []);
  let debts = get(selectedNetworth, 'debts', []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id='networth-dialog-title'>
        {months[Number(month) - 1]} {year}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ width: '35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h5' sx={{ mb: '.5rem' }}>
            Assets
          </Typography>
          <Typography align='right' variant='h5'>
            {numberToCurrency.format(
              reduce(
                assets,
                (sum, asset) => {
                  return sum + get(asset, 'amount', 0);
                },
                0
              )
            )}
          </Typography>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {assets.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.type}</TableCell>
                  <TableCell align='right'>
                    {numberToCurrency.format(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
          <Typography variant='h5' sx={{ mb: '.5rem' }}>
            Debts
          </Typography>
          <Typography align='right' variant='h5'>
            {numberToCurrency.format(
              reduce(
                debts,
                (sum, debt) => {
                  return sum + get(debt, 'amount', 0);
                },
                0
              )
            )}
          </Typography>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {debts.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.type}</TableCell>
                  <TableCell align='right'>
                    {numberToCurrency.format(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

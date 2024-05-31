import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import includes from 'lodash/includes';

import { useTheme } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

const findAmount = (transaction) => {
  if (transaction.amount) return transaction.amount;
  if (transaction.principal)
    return (
      transaction.principal +
      transaction.interest +
      (transaction.escrow ? transaction.escrow : 0)
    );
  if (transaction.take_home) return transaction.take_home;

  return 0;
};

const findSource = (transaction) => {
  if (transaction.vendor) return transaction.vendor;
  if (transaction.lender) return transaction.lender;
  if (transaction.employer) return transaction.employer;
  if (transaction.source) return transaction.source;
  return '';
};

export default function TransactionsTable(props) {
  const { transactions } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: transaction[`${transaction._type}_id`],
        attrs: transaction,
      })
    );
  };

  const findColor = (transaction) => {
    if (transaction.pending) return theme.palette.red[300];
    if (includes(['expense', 'repayment'], transaction._type))
      return theme.palette.red[600];
    if (includes(['income', 'paycheck'], transaction._type))
      return theme.palette.green[600];
    return theme.palette.red[300];
  };

  return (
    <TableContainer component={'div'}>
      <Table size='small'>
        <TableBody>
          {transactions.map((transaction, idx, array) => {
            const amount = findAmount(transaction);
            const source = findSource(transaction);
            const color = findColor(transaction);

            const sameDateAsPrevious =
              idx === 0
                ? false
                : dayjs(transaction.date).isSame(
                    dayjs(array[idx - 1].date),
                    'day'
                  );

            return (
              <TableRow
                hover={true}
                key={transaction[`${transaction._type}_id`]}
                onClick={() => handleClick(transaction)}
              >
                <CustomTableCell idx={idx} component='th' column='date'>
                  {sameDateAsPrevious
                    ? ''
                    : dayjs(transaction.date).format('MMM D')}
                </CustomTableCell>
                <CustomTableCell
                  idx={idx}
                  align='right'
                  sx={{ color, fontWeight: 'bold' }}
                >
                  {numberToCurrency.format(amount)}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {source}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

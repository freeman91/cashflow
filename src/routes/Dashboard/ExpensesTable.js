import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function ExpensesTable(props) {
  const { expenses } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClick = (expense) => {
    dispatch(
      openDialog({
        type: expense._type,
        mode: 'edit',
        id: expense.expense_id,
        attrs: expense,
      })
    );
  };

  const findColor = (expense) => {
    if (expense.pending) return theme.palette.red[300];
    return theme.palette.red[600];
  };

  return (
    <TableContainer component={'div'}>
      <Table size='small'>
        <TableBody>
          {expenses.map((expense, idx, array) => {
            const sameDateAsPrevious =
              idx === 0
                ? false
                : dayjs(expense.date).isSame(dayjs(array[idx - 1].date), 'day');
            const vendor = expense.vendor ? expense.vendor : expense.lender;
            const amount = expense.amount
              ? expense.amount
              : expense.principal +
                expense.interest +
                (expense.escrow ? expense.escrow : 0);
            const color = findColor(expense);

            return (
              <TableRow
                hover={true}
                key={
                  expense.expense_id ? expense.expense_id : expense.repayment_id
                }
                onClick={() => handleClick(expense)}
              >
                <CustomTableCell idx={idx} component='th' column='date'>
                  {sameDateAsPrevious
                    ? ''
                    : dayjs(expense.date).format('MMM D')}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right' sx={{ color }}>
                  {numberToCurrency.format(amount)}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {vendor}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

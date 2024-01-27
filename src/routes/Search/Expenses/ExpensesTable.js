import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function ExpensesTable(props) {
  const { expenses } = props;
  const dispatch = useDispatch();

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

  return (
    <Card raised>
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          sx={{
            maxWidth: 1000,
          }}
          component={'div'}
        >
          <Table size='small'>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ fontWeight: 800 }}>date</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  type
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  amount
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  vendor
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  paid
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(expenses, (expense, idx) => {
                const amount = (() => {
                  if (expense._type === 'expense') {
                    return expense.amount;
                  } else if (expense._type === 'repayment') {
                    return (
                      get(expense, 'principal', 0) +
                      get(expense, 'interest', 0) +
                      get(expense, 'escrow', 0)
                    );
                  } else {
                    return 0;
                  }
                })();
                return (
                  <TableRow
                    key={expense.expense_id || expense.repayment_id}
                    hover={true}
                    onClick={() => handleClick(expense)}
                  >
                    <CustomTableCell idx={idx} column='date'>
                      {dayjs(expense.date).format('MMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {expense._type}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {expense.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {expense.vendor ? expense.vendor : expense.lender}
                    </CustomTableCell>
                    <TableCell
                      scope='row'
                      align='right'
                      sx={{
                        borderBottom: 0,
                        borderTop:
                          idx === 0 ? '1px solid rgba(81, 81, 81, .5)' : 0,
                      }}
                    >
                      <Checkbox
                        edge='start'
                        checked={!expense.pending}
                        tabIndex={-1}
                        size='small'
                        sx={{
                          '&.MuiButtonBase-root': { padding: 0 },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));

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
    <Card sx={{ m: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <TableContainer component='div'>
          <Table size='medium'>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ p: 1, pl: 2, pb: 0 }}>date</TableCell>
                <TableCell sx={{ p: 1, pb: 0 }}>vendor</TableCell>
                {greaterThanSM && (
                  <TableCell sx={{ p: 1, pb: 0 }}>category</TableCell>
                )}
                <TableCell sx={{ p: 1, pb: 0 }} align='right'>
                  amount
                </TableCell>
                <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
                  paid
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(
                expenses.map((expense, idx, array) => {
                  const sameDateAsPrevious =
                    idx === 0
                      ? false
                      : dayjs(expense.date).isSame(
                          dayjs(array[idx - 1].date),
                          'day'
                        );
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
                      <CustomTableCell
                        idx={idx}
                        column='date'
                        sx={{ width: greaterThanSM ? '25%' : '33%' }}
                      >
                        {sameDateAsPrevious
                          ? ''
                          : dayjs(expense.date).format('MMM D')}
                      </CustomTableCell>
                      <CustomTableCell
                        idx={idx}
                        sx={{ width: greaterThanSM ? '30%' : '33%' }}
                      >
                        {expense.vendor ? expense.vendor : expense.lender}
                      </CustomTableCell>
                      {greaterThanSM && (
                        <CustomTableCell idx={idx}>
                          {expense.category}
                        </CustomTableCell>
                      )}
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(amount)}
                      </CustomTableCell>
                      <TableCell scope='row' align='right'>
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
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

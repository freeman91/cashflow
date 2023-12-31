import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
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

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function Expenses(props) {
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
    <Card
      raised
      sx={{
        minWidth: 400,
      }}
    >
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer component={'div'}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>date</TableCell>
                <TableCell align='right'>amount</TableCell>
                <TableCell align='right'>vendor</TableCell>
                <TableCell align='right'>paid</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(expenses, (expense, idx) => {
                let vendor = expense.vendor ? expense.vendor : expense.lender;

                const amount = expense.amount
                  ? expense.amount
                  : expense.principal +
                    expense.interest +
                    (expense.escrow ? expense.escrow : 0);

                return (
                  <TableRow
                    hover={true}
                    key={
                      expense.expense_id
                        ? expense.expense_id
                        : expense.repayment_id
                    }
                    onClick={() => handleClick(expense)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {dayjs(expense.date).format('MMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {vendor}
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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../Income/IncomesTable';

export default function Expenses() {
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const today = dayjs();
    const start = today.subtract(7, 'day');
    const end = today.add(7, 'day');

    let expenses = filter(allExpenses, (expense) => {
      const date = dayjs(expense.date);
      return date >= start && date <= end;
    });

    expenses = sortBy(expenses, 'date');

    setTableData(expenses);
  }, [allExpenses]);

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
      <CardHeader
        title='expenses'
        sx={{ pt: 1, pb: 0 }}
        titleTypographyProps={{
          variant: 'h6',
          align: 'left',
          sx: { fontWeight: 800 },
        }}
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          sx={{
            mt: 2,
            maxWidth: 1000,
          }}
          component={'div'}
        >
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>date</TableCell>
                <TableCell align='right'>amount</TableCell>
                <TableCell align='right'>category</TableCell>
                <TableCell align='right'>vendor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(tableData, (expense, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={expense.expense_id}
                    onClick={() => handleClick(expense)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {dayjs(expense.date).format('MMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(expense.amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {expense.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {expense.vendor}
                    </CustomTableCell>
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

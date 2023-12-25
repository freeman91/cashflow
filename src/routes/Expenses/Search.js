import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../Income/IncomesTable';

export default function Search() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);

  // const [range, setRange] = useState({ start: null, end: null });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _expenses = allExpenses;
    _expenses = sortBy(_expenses, 'date');
    setTableData(_expenses);
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
        // title='search'
        sx={{ pt: 1, pb: 0 }}
        titleTypographyProps={{
          variant: 'h6',
          align: 'left',
          sx: { fontWeight: 800 },
        }}
        action={
          <Stack direction='row'>
            <IconButton onClick={() => {}}>
              <CalendarMonthIcon />
            </IconButton>
            <IconButton onClick={() => {}}>
              <FilterListIcon />
            </IconButton>
          </Stack>
        }
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          raised
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
                <TableCell align='right'>paid</TableCell>
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
                    <CustomTableCell idx={idx} align='right'>
                      {expense.pending ? '' : 'paid'}
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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../Income/IncomesTable';

const start = dayjs().date(1).subtract(1, 'month');
const end = start.add(3, 'month').date(0);

export default function Search() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [range, setRange] = useState({ start, end });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _expenses = [...allExpenses, ...allRepayments];

    _expenses = filter(_expenses, (expense) => {
      return dayjs(expense.date).isBetween(range.start, range.end);
    });

    _expenses = sortBy(_expenses, 'date');
    setTableData(_expenses);
  }, [allExpenses, allRepayments, range]);

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
        sx={{
          pt: 1,
          pl: 2,
          pr: 2,
          pb: 0,
          '.MuiCardHeader-action': { width: '100%' },
        }}
        action={
          <Stack direction='row' justifyContent='space-around'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <IconButton onClick={() => {}}>
                <CalendarMonthIcon />
              </IconButton>
              <Typography variant='body1'>
                {range.start.format('MMM D')} - {range.end.format('MMM D')}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <IconButton onClick={() => {}}>
                <FilterListIcon />
              </IconButton>
              <Typography variant='body1'>filter</Typography>
            </div>
          </Stack>
        }
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
                <TableCell align='right'>type</TableCell>
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
                      {expense._type}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(
                        expense.amount
                          ? expense.amount
                          : expense.principal + expense.interest
                      )}
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

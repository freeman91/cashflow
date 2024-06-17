import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function IncomesTable(props) {
  const { incomes } = props;
  const dispatch = useDispatch();

  const handleClick = (income) => {
    dispatch(
      openDialog({
        type: income._type,
        mode: 'edit',
        id: income[`${income._type}_id`],
        attrs: income,
      })
    );
  };

  return (
    <Card raised sx={{ m: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <TableContainer component={'div'}>
          <Table>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ p: 1, pl: 2, pb: 0 }}>date</TableCell>
                <TableCell sx={{ p: 1, pb: 0 }} align='right'>
                  amount
                </TableCell>
                <TableCell sx={{ p: 1, pb: 0 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
                  source
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income, idx, array) => {
                const amount = (() => {
                  if (income._type === 'income') {
                    return income.amount;
                  } else if (income._type === 'paycheck') {
                    return get(income, 'take_home', 0);
                  } else {
                    return 0;
                  }
                })();
                const sameDateAsPrevious =
                  idx === 0
                    ? false
                    : dayjs(income.date).isSame(
                        dayjs(array[idx - 1].date),
                        'day'
                      );
                return (
                  <TableRow
                    key={income.income_id || income.paycheck_id}
                    hover={true}
                    onClick={() => handleClick(income)}
                  >
                    <CustomTableCell idx={idx} column='date'>
                      {sameDateAsPrevious
                        ? ''
                        : dayjs(income.date).format('MMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {income.category || 'paycheck'}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {income.source || income.employer}
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

import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import map from 'lodash/map';

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
        id: income.income_id,
        attrs: income,
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
                <TableCell>date</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  amount
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  source
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(incomes, (income, idx) => {
                const amount = (() => {
                  if (income._type === 'income') {
                    return income.amount;
                  } else if (income._type === 'paycheck') {
                    return get(income, 'take_home', 0);
                  } else {
                    return 0;
                  }
                })();
                return (
                  <TableRow
                    key={income.income_id || income.paycheck_id}
                    hover={true}
                    onClick={() => handleClick(income)}
                  >
                    <CustomTableCell idx={idx} column='date'>
                      {dayjs(income.date).format('MMM D')}
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

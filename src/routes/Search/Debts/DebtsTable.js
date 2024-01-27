import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import map from 'lodash/map';
import find from 'lodash/find';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { CustomTableCell } from '../../../components/Table/CustomTableCell';
import { numberToCurrency } from '../../../helpers/currency';

export default function DebtsTable(props) {
  const { debts } = props;
  const accounts = useSelector((state) => state.accounts.data);
  const dispatch = useDispatch();

  const handleClick = (debt) => {
    dispatch(push('/app/debts/' + debt.debt_id));
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
                <TableCell sx={{ fontWeight: 800 }}>name</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  account
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(debts, (debt, idx) => {
                const account = find(accounts, {
                  account_id: debt.account_id,
                });
                return (
                  <TableRow
                    key={debt.debt_id}
                    hover={true}
                    onClick={() => handleClick(debt)}
                  >
                    <CustomTableCell idx={idx} column='day'>
                      {debt.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} column='day'>
                      {account?.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {debt.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(debt.amount)}
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

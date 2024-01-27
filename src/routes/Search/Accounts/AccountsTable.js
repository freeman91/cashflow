import React from 'react';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function AccountsTable(props) {
  const { accounts } = props;
  const dispatch = useDispatch();

  const handleClick = (account) => {
    dispatch(
      openDialog({
        type: account._type,
        mode: 'edit',
        id: account.account_id,
        attrs: account,
      })
    );
  };

  return (
    <Card raised sx={{ minWidth: 400 }}>
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
                <TableCell>name</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  link
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(accounts, (account, idx) => {
                return (
                  <TableRow
                    key={account.account_id}
                    hover={true}
                    onClick={() => handleClick(account)}
                  >
                    <CustomTableCell idx={idx} column='day'>
                      {account.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {account.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {account.url}
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

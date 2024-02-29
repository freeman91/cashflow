import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

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

export default function AccountsTable(props) {
  const { accounts } = props;
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _accounts = map(accounts, (account) => {
      const accountAssets = filter(allAssets, (asset) => {
        return asset.account_id === account.account_id;
      });
      const accountDebts = filter(allDebts, (debt) => {
        return debt.account_id === account.account_id;
      });
      return {
        ...account,
        value:
          accountAssets.reduce((acc, asset) => acc + asset.value, 0) -
          accountDebts.reduce((acc, debt) => acc + debt.amount, 0),
      };
    });

    setTableData(sortBy(_accounts, 'value').reverse());
  }, [accounts, allAssets, allDebts]);

  const handleClick = (account) => {
    dispatch(push('/app/accounts/' + account.account_id));
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
                <TableCell sx={{ fontWeight: 800 }}>value</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  link
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(tableData, (account, idx) => {
                return (
                  <TableRow
                    key={account.account_id}
                    hover={true}
                    onClick={() => handleClick(account)}
                  >
                    <CustomTableCell idx={idx} column='day'>
                      {account.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} column='day'>
                      {numberToCurrency.format(account.value)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {account.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {/* {account.url} */}
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

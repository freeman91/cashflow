import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import LaunchIcon from '@mui/icons-material/Launch';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function Accounts() {
  const dispatch = useDispatch();
  const allAccounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    let _accounts = allAccounts.map((account) => {
      const accountAssets = allAssets.filter(
        (asset) => asset.account_id === account.account_id
      );
      const accountDebts = allDebts.filter(
        (debt) => debt.account_id === account.account_id
      );

      const assetsSum = reduce(
        accountAssets,
        (sum, asset) => sum + asset.value,
        0
      );
      const debtsSum = reduce(
        accountDebts,
        (sum, debt) => sum + debt.amount,
        0
      );

      return {
        ...account,
        assetsSum: assetsSum,
        debtsSum: debtsSum,
        net: assetsSum - debtsSum,
      };
    });

    setAccounts(sortBy(_accounts, 'net').reverse());
  }, [allAccounts, allAssets, allDebts]);

  const handleClick = (account) => {
    dispatch(push('/accounts/' + account.account_id));
  };

  const handleLinkClick = (e, account) => {
    e.stopPropagation();
    window.open(account?.url, '_blank');
  };

  return (
    <Card raised>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <TableContainer component={'div'}>
          <Table size='small'>
            <TableBody>
              {accounts.map((account, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={account.account_id}
                    onClick={() => handleClick(account)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {account.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(account.net)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      <IconButton
                        size='small'
                        color='primary'
                        onClick={(e) => handleLinkClick(e, account)}
                      >
                        <LaunchIcon sx={{ height: 20, width: 20 }} />
                      </IconButton>
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

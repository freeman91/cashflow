import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';

import Grid from '@mui/material/Grid2';

import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Forms/AccountForm';
import AccountsSummary from './Summary';
import AccountGroupGrid from './AccountGroupGrid';
import NetWorth from './Networth';

export default function AccountsRoot() {
  const accounts = useSelector((state) => state.accounts.data);

  const [groupedAccounts, setGroupedAccounts] = useState([]);

  useEffect(() => {
    const assetAccounts = accounts.filter(
      (account) => account.account_type === ASSET
    );
    const liabilityAccounts = accounts.filter(
      (account) => account.account_type === LIABILITY
    );

    let assetsGrouped = groupBy(assetAccounts, 'asset_type');
    let liabilitiesGrouped = groupBy(liabilityAccounts, 'liability_type');

    assetsGrouped = Object.entries(assetsGrouped).map(([type, items]) => {
      const groupAccounts = items.map((item) => ({
        ...item,
        _amount: findAmount(item),
      }));
      return {
        account_type: ASSET,
        type,
        sum: groupAccounts.reduce((acc, account) => acc + account._amount, 0),
        items: groupAccounts.sort((a, b) => b._amount - a._amount),
      };
    });
    assetsGrouped.sort((a, b) => b.sum - a.sum);

    liabilitiesGrouped = Object.entries(liabilitiesGrouped).map(
      ([type, items]) => {
        const groupAccounts = items.map((item) => ({
          ...item,
          _amount: findAmount(item),
        }));
        return {
          account_type: LIABILITY,
          type,
          sum: -groupAccounts.reduce(
            (acc, account) => acc + account._amount,
            0
          ),
          items: groupAccounts.sort((a, b) => b._amount - a._amount),
        };
      }
    );
    liabilitiesGrouped.sort((a, b) => b.sum + a.sum);

    setGroupedAccounts([...assetsGrouped, ...liabilitiesGrouped]);
  }, [accounts]);

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        pb: 5,
      }}
    >
      <NetWorth />
      <Grid size={{ xs: 12, md: 8 }} display='flex' justifyContent='center'>
        <Grid container spacing={2}>
          {groupedAccounts.map((group, idx) => {
            const { type, sum, items } = group;
            return (
              <AccountGroupGrid key={idx} type={type} sum={sum} items={items} />
            );
          })}
        </Grid>
      </Grid>
      <AccountsSummary groupedAccounts={groupedAccounts} />
    </Grid>
  );
}

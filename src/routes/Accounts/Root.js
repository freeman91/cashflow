import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';
import find from 'lodash/find';
import get from 'lodash/get';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Forms/AccountForm';
import AccountsSummary from './Summary';
import AccountGroupGrid from './AccountGroupGrid';
import NetWorth from './Networth';

export default function AccountsRoot() {
  const accounts = useSelector((state) => state.accounts.data);
  const histories = useSelector((state) => state.histories.data);

  const [showInactive, setShowInactive] = useState(false);
  const [groupedAccounts, setGroupedAccounts] = useState([]);

  useEffect(() => {
    const lastMonth = dayjs().subtract(1, 'month');
    const assetAccounts = accounts.filter(
      (account) => account.account_type === ASSET
    );
    const liabilityAccounts = accounts.filter(
      (account) => account.account_type === LIABILITY
    );

    let assetsGrouped = groupBy(assetAccounts, 'asset_type');
    let liabilitiesGrouped = groupBy(liabilityAccounts, 'liability_type');

    assetsGrouped = Object.entries(assetsGrouped).map(([type, items]) => {
      const groupAccounts = items.map((item) => {
        const history = histories.find((history) => {
          return (
            history.item_id === item.account_id &&
            history.month ===
              lastMonth.year() +
                '-' +
                (lastMonth.month() + 1).toString().padStart(2, '0')
          );
        });

        const dayValue = find(history?.values, (value) => {
          return value.date === lastMonth.format('YYYY-MM-DD');
        });
        return {
          ...item,
          lastMonthAmount: get(dayValue, 'value', 0),
          _amount: findAmount(item),
        };
      });

      return {
        account_type: ASSET,
        type,
        lastMonthSum: groupAccounts.reduce(
          (acc, account) => acc + account.lastMonthAmount,
          0
        ),
        sum: groupAccounts.reduce((acc, account) => acc + account._amount, 0),
        items: groupAccounts.sort((a, b) => b._amount - a._amount),
      };
    });
    assetsGrouped.sort((a, b) => b.sum - a.sum);

    liabilitiesGrouped = Object.entries(liabilitiesGrouped).map(
      ([type, items]) => {
        const groupAccounts = items.map((item) => {
          const history = histories.find((history) => {
            return (
              history.item_id === item.account_id &&
              history.month ===
                lastMonth.year() +
                  '-' +
                  (lastMonth.month() + 1).toString().padStart(2, '0')
            );
          });
          const dayValue = find(history?.values, (value) => {
            return value.date === lastMonth.format('YYYY-MM-DD');
          });
          return {
            lastMonthAmount: get(dayValue, 'value', 0),
            ...item,
            _amount: findAmount(item),
          };
        });
        return {
          account_type: LIABILITY,
          type,
          sum: -groupAccounts.reduce(
            (acc, account) => acc + account._amount,
            0
          ),
          lastMonthSum: -groupAccounts.reduce(
            (acc, account) => acc + account.lastMonthAmount,
            0
          ),
          items: groupAccounts.sort((a, b) => b._amount - a._amount),
        };
      }
    );
    liabilitiesGrouped.sort((a, b) => b.sum + a.sum);

    setGroupedAccounts([...assetsGrouped, ...liabilitiesGrouped]);
  }, [accounts, histories]);

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
            const { type, sum, items, lastMonthSum } = group;
            return (
              <AccountGroupGrid
                key={idx}
                type={type}
                sum={sum}
                lastMonthSum={lastMonthSum}
                items={items}
                showInactive={showInactive}
              />
            );
          })}
          <Grid size={{ xs: 12 }} display='flex' justifyContent='center'>
            <Link
              underline='hover'
              color='text.secondary'
              onClick={() => {
                setShowInactive(!showInactive);
              }}
            >
              <Typography variant='h6' sx={{ mr: 1 }}>
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <AccountsSummary groupedAccounts={groupedAccounts} />
    </Grid>
  );
}

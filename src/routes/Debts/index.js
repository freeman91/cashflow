import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import NewTransactionButton from '../../components/NewTransactionButton';
import DebtsSummary from './DebtsSummary';
import DebtCard from '../Accounts/DebtCard';

export default function Debts() {
  const theme = useTheme();
  const accounts = useSelector((state) => state.accounts.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [groupedDebts, setGroupedDebts] = useState([]);

  useEffect(() => {
    setGroupedDebts(groupBy(allDebts, 'account_id'));
  }, [accounts, allDebts]);

  return (
    <>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ minWidth: 550, maxWidth: theme.breakpoints.maxWidth }}
      >
        <DebtsSummary />
        {map(groupedDebts, (debts, accountId) => {
          const account = find(accounts, { account_id: accountId });
          return (
            <React.Fragment key={accountId}>
              <Typography align='left' sx={{ width: '100%' }}>
                {account.name}
              </Typography>
              {map(debts, (debt) => (
                <DebtCard key={debt.debt_id} debt={debt} />
              ))}
            </React.Fragment>
          );
        })}
      </Stack>
      <NewTransactionButton transactionTypes={['debt', 'purchase', 'sale']} />
    </>
  );
}

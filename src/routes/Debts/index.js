import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';

import { useTheme } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import NewTransactionButton from '../../components/NewTransactionButton';
import DebtsSummary from './DebtsSummary';
import DebtCard from '../Accounts/DebtCard';

export default function Debts() {
  const theme = useTheme();
  const allDebts = useSelector((state) => state.debts.data);

  const [debts, setDebts] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  useEffect(() => {
    let _debts = cloneDeep(allDebts);
    let _creditCards = remove(_debts, (debt) => debt.category === 'credit');

    setDebts(sortBy(_debts, 'amount').reverse());
    setCreditCards(sortBy(_creditCards, 'amount').reverse());
  }, [allDebts]);

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
        {map(debts, (debt) => {
          return <DebtCard key={debt.debt_id} debt={debt} />;
        })}
        <React.Fragment>
          <Typography align='left' sx={{ width: '100%' }}>
            credit cards
          </Typography>
          {map(creditCards, (debt) => (
            <DebtCard key={debt.debt_id} debt={debt} />
          ))}
        </React.Fragment>
      </Stack>
      <NewTransactionButton
        transactionTypes={['debt', 'repayment', 'borrow']}
      />
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { findId } from '../../helpers/transactions';
import { _numberToCurrency } from '../../helpers/currency';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import BorrowsStack from './BorrowsStack';
import RepaymentsStack from './RepaymentsStack';
import ItemBox from '../../components/ItemBox';
import DataBox from '../../components/DataBox';
import DebtChart from '../Networth/DebtChart';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import TransactionBox from '../../components/TransactionBox';

export default function DebtPage(props) {
  const { debt } = props;

  const allBorrows = useSelector((state) => state.borrows.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [tabIdx, setTabIdx] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [borrowSum, setBorrowSum] = useState(0);
  const [repayments, setRepayments] = useState([]);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (repayments.length > 0) {
      setTabIdx('repayments');
    } else if (borrows.length > 0) {
      setTabIdx('borrows');
    } else if (transactions.length > 0) {
      setTabIdx('transactions');
    } else {
      setTabIdx('history');
    }
  }, [borrows.length, repayments.length, transactions.length]);

  useEffect(() => {
    const debtBorrows = filter(allBorrows, { debt_id: debt.debt_id });
    setBorrowSum(reduce(debtBorrows, (acc, borrow) => acc + borrow.amount, 0));
    setBorrows(sortBy(debtBorrows, 'date').reverse());
  }, [allBorrows, debt.debt_id]);

  useEffect(() => {
    let debtRepayments = filter(allRepayments, { debt_id: debt.debt_id });
    const sums = reduce(
      debtRepayments,
      (acc, repayment) => {
        if (repayment.pending) return acc;
        return {
          principal: acc.principal + get(repayment, 'principal', 0),
          interest: acc.interest + get(repayment, 'interest', 0),
          escrow: acc.escrow + get(repayment, 'escrow', 0),
        };
      },
      { principal: 0, interest: 0, escrow: 0 }
    );
    setPrincipalSum(sums.principal);
    setInterestSum(sums.interest);
    setEscrowSum(sums.escrow);
    setRepayments(debtRepayments);
  }, [allRepayments, debt.debt_id]);

  useEffect(() => {
    let _transactions = [];
    if (debt.can_pay_from) {
      const expenses = filter(allExpenses, { payment_from_id: debt.debt_id });
      const repayments = filter(allRepayments, {
        payment_from_id: debt.debt_id,
      });
      _transactions = [...expenses, ...repayments];
    }

    setTransactions(sortBy(_transactions, 'date').reverse());
  }, [debt, allExpenses, allRepayments]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Card raised sx={{ borderRadius: '10px', py: 1 }}>
          <ItemBox item={debt} />
        </Card>
      </Grid>
      {tabIdx !== null && (
        <Grid item xs={12} mx={2}>
          <StyledTabs
            value={tabIdx}
            onChange={handleChange}
            variant='fullWidth'
          >
            {repayments.length !== 0 && (
              <StyledTab label='borrows' value='borrows' />
            )}
            {borrows.length !== 0 && (
              <StyledTab label='repayments' value='repayments' />
            )}
            {transactions.length !== 0 && (
              <StyledTab label='transactions' value='transactions' />
            )}
            <StyledTab label='history' value='history' />
          </StyledTabs>
        </Grid>
      )}
      {tabIdx === 'repayments' && repayments.length !== 0 && (
        <>
          <Grid item xs={12} mx={2} pt='2px !important'>
            <DataBox label='principal' value={principalSum} />
          </Grid>
          <Grid item xs={12} mx={2} pt='2px !important'>
            <DataBox label='interest' value={interestSum} />
          </Grid>
          {escrowSum > 0 && (
            <Grid item xs={12} mx={2} pt={'4px !important'}>
              <DataBox label='escrow' value={escrowSum} />
            </Grid>
          )}
          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <RepaymentsStack debtId={debt.debt_id} />
          </Grid>
        </>
      )}
      {tabIdx === 'borrows' && borrows.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'2px !important'}>
            {borrows.length > 1 && (
              <Grid item xs={12} mx={2} pt='2px !important'>
                <BoxFlexCenter>
                  <Typography variant='h5' color='text.secondary'>
                    $
                  </Typography>
                  <Typography variant='h5' color='white' fontWeight='bold'>
                    {_numberToCurrency.format(borrowSum)}
                  </Typography>
                </BoxFlexCenter>
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <BorrowsStack debtId={debt.debt_id} />
          </Grid>
        </>
      )}
      {tabIdx === 'transactions' && transactions.length !== 0 && (
        <Grid item xs={12} mx={1} mb={10} pt={'2px !important'}>
          <Card raised>
            <Stack spacing={1} direction='column' pt={1} pb={1}>
              {map(transactions, (transaction, idx) => {
                const key = findId(transaction);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox transaction={transaction} />
                    {idx < transactions.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      {tabIdx === 'history' && (
        <Grid item xs={12} mx={1} pt={'2px !important'}>
          <DebtChart debt={debt} />
        </Grid>
      )}
    </>
  );
}

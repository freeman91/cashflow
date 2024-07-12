import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import BorrowsStack from './BorrowsStack';
import RepaymentsStack from './RepaymentsStack';
import ItemBox from '../../components/ItemBox';
import DataBox from '../../components/DataBox';

export default function DebtPage(props) {
  const { debt } = props;

  const allBorrows = useSelector((state) => state.borrows.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [tabIdx, setTabIdx] = useState(0);
  const [borrows, setBorrows] = useState([]);
  const [borrowSum, setBorrowSum] = useState(0);
  const [repayments, setRepayments] = useState([]);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

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

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <ItemBox item={debt} />
      </Grid>
      <Grid item xs={12}>
        <StyledTabs value={tabIdx} onChange={handleChange} centered>
          <StyledTab label='repayments' sx={{ width: '35%' }} />
          <StyledTab label='borrows' sx={{ width: '35%' }} />
        </StyledTabs>
      </Grid>
      {tabIdx === 0 && repayments.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'2px !important'}>
            <DataBox label='principal' value={principalSum} />
          </Grid>
          <Grid item xs={12} mx={1} pt={'4px !important'}>
            <DataBox label='interest' value={interestSum} />
          </Grid>
          {escrowSum > 0 && (
            <Grid item xs={12} mx={1} pt={'4px !important'}>
              <DataBox label='escrow' value={escrowSum} />
            </Grid>
          )}
          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <RepaymentsStack debtId={debt.debt_id} />
          </Grid>
        </>
      )}
      {tabIdx === 1 && borrows.length !== 0 && (
        <>
          <Grid item xs={12} mx={1} pt={'2px !important'}>
            <DataBox label='total' value={borrowSum} />
          </Grid>
          <Grid item xs={12} mx={1} mb={10} pt={'0 !important'}>
            <BorrowsStack debtId={debt.debt_id} />
          </Grid>
        </>
      )}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refresh } from '../../store/user';
import { openDialog } from '../../store/dialogs';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import AllocationChart from '../Account/AllocationChart';
import BorrowsStack from './BorrowsStack';
import RepaymentsStack from './RepaymentsStack';
import DebtChart from './DebtChart';
import CustomAppBar from '../../components/CustomAppBar';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import EditButton from '../../components/CustomAppBar/EditButton';

const BORROWS = 'borrows';
const REPAYMENTS = 'repayments';
const HISTORY = 'history';

const CustomToggleButton = (props) => {
  return <ToggleButton {...props} sx={{ py: 0.5, color: 'text.secondary' }} />;
};

export default function Debt() {
  const dispatch = useDispatch();
  const location = useLocation();

  const debts = useSelector((state) => state.debts.data);
  const allBorrows = useSelector((state) => state.borrows.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [debt, setDebt] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [borrowSum, setBorrowSum] = useState(0);
  const [repayments, setRepayments] = useState([]);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  const [tab, setTab] = useState(BORROWS);

  const onRefresh = async () => {
    dispatch(refresh());
  };
  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  useEffect(() => {
    if (location.state?.debtId) {
      setDebt(debts.find((a) => a.debt_id === location.state.debtId));
    }
  }, [location.state?.debtId, debts]);

  useEffect(() => {
    const borrows = filter(allBorrows, { debt_id: debt?.debt_id });
    setBorrowSum(reduce(borrows, (acc, borrow) => acc + borrow.amount, 0));
    setBorrows(borrows);
    const repayments = filter(allRepayments, { debt_id: debt?.debt_id });
    setPrincipalSum(
      reduce(
        repayments,
        (acc, repayment) => acc + (repayment.pending ? 0 : repayment.principal),
        0
      )
    );
    setInterestSum(
      reduce(
        repayments,
        (acc, repayment) => acc + (repayment.pending ? 0 : repayment.interest),
        0
      )
    );
    setEscrowSum(
      reduce(
        repayments,
        (acc, repayment) => acc + (repayment.pending ? 0 : repayment.escrow),
        0
      )
    );
    setRepayments(repayments);
  }, [allBorrows, allRepayments, debt?.debt_id]);

  useEffect(() => {
    if (borrows.length === 0 && repayments.length > 0) {
      setTab(REPAYMENTS);
    } else if (borrows.length === 0 && repayments.length === 0) {
      setTab(HISTORY);
    }
  }, [borrows, repayments]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {debt?.name}
          </Typography>
        }
        right={
          <EditButton
            handleClick={() =>
              dispatch(openDialog({ type: 'debt', mode: 'edit', attrs: debt }))
            }
          />
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: '42px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box sx={{ width: '100%', mx: 1 }}>
            <Grid container>
              <Grid item xs={6}>
                <Stack direction='column'>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    align='center'
                  >
                    amount
                  </Typography>
                  <BoxFlexCenter sx={{ justifyContent: 'center' }}>
                    <Typography variant='h6' color='text.secondary'>
                      $
                    </Typography>
                    <Typography variant='h5' color='white' fontWeight='bold'>
                      {_numberToCurrency.format(debt?.amount)}
                    </Typography>
                  </BoxFlexCenter>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      align='center'
                    >
                      allocation
                    </Typography>
                  </Grid>
                  <AllocationChart type='debts' sum={debt?.amount} xs={12} />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        {borrowSum > 0 && (
          <Grid item xs={12}>
            <Typography variant='body1' color='text.secondary' align='center'>
              borrowed
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(borrowSum)}
            </Typography>
          </Grid>
        )}
        {principalSum > 0 && (
          <Grid item xs={4}>
            <Typography variant='body1' color='text.secondary' align='center'>
              principal
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(principalSum)}
            </Typography>
          </Grid>
        )}
        {interestSum > 0 && (
          <Grid item xs={4}>
            <Typography variant='body1' color='text.secondary' align='center'>
              interest
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(interestSum)}
            </Typography>
          </Grid>
        )}
        {escrowSum > 0 && (
          <Grid item xs={4}>
            <Typography variant='body1' color='text.secondary' align='center'>
              escrow
            </Typography>
            <Typography variant='h6' fontWeight='bold' align='center'>
              {numberToCurrency.format(escrowSum)}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} display='flex' justifyContent='center'>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
            sx={{ mt: 1, px: 1 }}
          >
            {borrows.length > 0 && (
              <CustomToggleButton value={BORROWS}>{BORROWS}</CustomToggleButton>
            )}
            {repayments.length > 0 && (
              <CustomToggleButton value={REPAYMENTS}>
                {REPAYMENTS}
              </CustomToggleButton>
            )}
            <CustomToggleButton value={HISTORY}>{HISTORY}</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='center'>
          {tab === BORROWS && <BorrowsStack debtId={debt?.debt_id} />}
          {tab === REPAYMENTS && <RepaymentsStack debtId={debt?.debt_id} />}
          {tab === HISTORY && <DebtChart debt={debt} />}
        </Grid>
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}

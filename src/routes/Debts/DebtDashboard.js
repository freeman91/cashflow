import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { goBack } from 'redux-first-history';
import find from 'lodash/find';
import filter from 'lodash/filter';

import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import NewTransactionButton from '../../components/NewTransactionButton';
import { openDialog } from '../../store/dialogs';
import BorrowsTable from './BorrowsTable';
import RepaymentsTable from './RepaymentsTable';
import { numberToCurrency } from '../../helpers/currency';

export default function DebtDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();

  const debts = useSelector((state) => state.debts.data);
  const allBorrows = useSelector((state) => state.borrows.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [id, setId] = useState('');
  const [debt, setDebt] = useState({});
  const [borrows, setBorrows] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [borrowSum, setBorrowSum] = useState(0);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setIntrestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/app/debts', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _borrows = filter(allBorrows, { debt_id: id });
      setBorrows(_borrows);

      let _repayments = filter(allRepayments, { debt_id: id });
      setRepayments(_repayments);

      setDebt(find(debts, { debt_id: id }));
    } else {
      setDebt({});
    }
  }, [id, allBorrows, allRepayments, debts]);

  useEffect(() => {
    setBorrowSum(borrows.reduce((acc, curr) => acc + curr.amount, 0));
  }, [borrows]);

  useEffect(() => {
    setPrincipalSum(repayments.reduce((acc, curr) => acc + curr.principal, 0));
    setIntrestSum(repayments.reduce((acc, curr) => acc + curr.interest, 0));
    setEscrowSum(
      repayments.reduce((acc, curr) => acc + (curr.escrow ? curr.escrow : 0), 0)
    );
  }, [repayments]);

  if (!id) return null;

  return (
    <>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: 1000 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '66%',
          }}
        >
          <Tooltip title='back' placement='left'>
            <IconButton color='primary' onClick={() => dispatch(goBack())}>
              <BackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant='h4' align='center' sx={{ width: '100%' }}>
            {debt?.name}
          </Typography>
          <Tooltip title='edit' placement='right'>
            <IconButton
              color='primary'
              onClick={() =>
                dispatch(
                  openDialog({
                    type: debt?._type,
                    mode: 'edit',
                    id: debt?.debt_id,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <Typography variant='h6' align='left' sx={{ width: '100%' }}>
            borrowed
          </Typography>
          <Typography variant='h6' align='right' sx={{ width: '100%' }}>
            {numberToCurrency.format(borrowSum)}
          </Typography>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <Typography variant='h6' align='left' sx={{ width: '100%' }}>
            principal
          </Typography>
          <Typography variant='h6' align='right' sx={{ width: '100%' }}>
            {numberToCurrency.format(principalSum)}
          </Typography>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '50%',
          }}
        >
          <Typography variant='h6' align='left' sx={{ width: '100%' }}>
            interest
          </Typography>
          <Typography variant='h6' align='right' sx={{ width: '100%' }}>
            {numberToCurrency.format(interestSum)}
          </Typography>
        </div>

        {escrowSum > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '50%',
            }}
          >
            <Typography variant='h6' align='left' sx={{ width: '100%' }}>
              Escrow
            </Typography>
            <Typography variant='h6' align='right' sx={{ width: '100%' }}>
              {numberToCurrency.format(escrowSum)}
            </Typography>
          </div>
        )}

        {borrows.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {borrows.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            borrows
          </Typography>
        )}
        {borrows.length > 0 && <BorrowsTable debtId={id} />}

        {repayments.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {repayments.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            repayments
          </Typography>
        )}
        {repayments.length > 0 && <RepaymentsTable debtId={id} />}
      </Stack>
      <NewTransactionButton transactionTypes={['borrow', 'repayment']} />
    </>
  );
}

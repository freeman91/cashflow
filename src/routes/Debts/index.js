import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { goBack } from 'redux-first-history';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { useTheme } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import NewTransactionButton from '../../components/NewTransactionButton';
import { openDialog } from '../../store/dialogs';
import BorrowCard from './BorrowCard';
import RepaymentCard from './RepaymentCard';

export default function Debts() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();

  const debts = useSelector((state) => state.debts.data);
  const allPurchases = useSelector((state) => state.borrows.data);
  const allSales = useSelector((state) => state.repayments.data);

  const [id, setId] = useState('');
  const [debt, setDebt] = useState({});
  const [borrows, setPurchases] = useState([]);
  const [repayments, setSales] = useState([]);

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/app/debts', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _borrows = filter(allPurchases, { debt_id: id });
      setPurchases(_borrows);

      let _repayments = filter(allSales, { debt_id: id });
      setSales(_repayments);

      setDebt(find(debts, { debt_id: id }));
    } else {
      setDebt({});
    }
  }, [id, allPurchases, allSales, debts]);

  if (!id) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
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
        {borrows.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {borrows.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            borrows
          </Typography>
        )}
        {borrows.map((borrow) => (
          <BorrowCard key={borrow.borrow_id} borrow={borrow} />
        ))}
        {repayments.length > 0 && <Divider flexItem sx={{ pt: 1, pb: 1 }} />}
        {repayments.length > 0 && (
          <Typography sx={{ width: '100%' }} align='left'>
            repayments
          </Typography>
        )}
        {repayments.map((repayment) => (
          <RepaymentCard key={repayment.repayment_id} repayment={repayment} />
        ))}
      </Stack>
      <NewTransactionButton transactionTypes={['borrow', 'repayment']} />
    </Box>
  );
}

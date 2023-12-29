import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { goBack } from 'redux-first-history';
import find from 'lodash/find';
import filter from 'lodash/filter';

import { useTheme } from '@mui/material';
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

export default function DebtDashboard() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();

  const debts = useSelector((state) => state.debts.data);
  const allBorrows = useSelector((state) => state.borrows.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [id, setId] = useState('');
  const [debt, setDebt] = useState({});
  const [borrows, setBorrows] = useState([]);
  const [repayments, setRepayments] = useState([]);

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

  if (!id) return null;

  return (
    <>
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

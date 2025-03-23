import React, { useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import useTransactionsInRange from '../../../store/hooks/useTransactions';
import CreateTransactionButton from './CreateTransactionButton';
import TransactionsTable from '../../../components/TransactionsTable';

export default function Transactions() {
  const [range] = useState({
    start: dayjs().subtract(7, 'day'),
    end: dayjs(),
  });
  const [types] = useState([]);

  const transactionsByDay = useTransactionsInRange(types, range, true);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          mb: 1,
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
        }}
      >
        <Typography variant='body1' fontWeight='bold' color='textSecondary'>
          RECENT TRANSACTIONS
        </Typography>
        <CreateTransactionButton />
      </Box>
      <TransactionsTable transactionsByDay={transactionsByDay} />
    </Grid>
  );
}

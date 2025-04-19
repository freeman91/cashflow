import React, { useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import useTransactionsInRange from '../../store/hooks/useTransactions';
import TransactionsTable from '../../components/TransactionsTable';
import RangeSelect from '../../components/Selector/RangeSelect';
import TransactionTypeSelect from '../../components/Selector/TransactionTypeSelect';

export default function TransactionsList() {
  const [types, setTypes] = useState([]);
  const [range, setRange] = useState({
    id: 9,
    label: 'Custom Range',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(3, 'day'),
  });
  const transactionsByDay = useTransactionsInRange(types, range, true);

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            p: 1,
          }}
        >
          <RangeSelect range={range} setRange={setRange} />
          <TransactionTypeSelect types={types} setTypes={setTypes} />
        </Box>
      </Grid>
      <TransactionsTable transactionsByDay={transactionsByDay} />
    </>
  );
}

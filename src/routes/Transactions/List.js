import React, { useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import useTransactionsInRange from '../../store/hooks/useTransactions';
import TransactionsTable from '../../components/TransactionsTable';
import TransactionSummary from '../../components/TransactionSummary';
import RangeSelect from '../../components/Selector/RangeSelect';
import TransactionFilters from '../../components/Selector/TransactionFilters';
import { useTransactionFilters } from '../../store/hooks/useTransactionFilters';

export default function TransactionsList() {
  const [filters, setFilters] = useState({
    types: [],
    amountOperator: '',
    amountValue: '',
    keyword: '',
    category: '',
  });

  const defaultStart = dayjs().subtract(1, 'month').startOf('month');
  const defaultEnd = dayjs().add(3, 'day');
  const [range, setRange] = useState({
    id: 9,
    label: `${defaultStart.format('MMM Do')} - ${defaultEnd.format('MMM Do')}`,
    start: defaultStart,
    end: defaultEnd,
  });
  const days = useTransactionsInRange(filters.types, range);
  const { filteredTransactions, categories } = useTransactionFilters(
    days.flatMap((day) => day.transactions),
    filters
  );

  // Group filtered transactions back into days
  const filteredDays = days.map((day) => ({
    ...day,
    transactions: day.transactions.filter((transaction) =>
      filteredTransactions.includes(transaction)
    ),
  }));

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TransactionFilters
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TransactionSummary transactionsByDay={filteredDays} />
      </Grid>
      <TransactionsTable transactionsByDay={filteredDays} />
    </>
  );
}

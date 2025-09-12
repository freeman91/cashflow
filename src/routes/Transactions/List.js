import React, { useState } from 'react';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTransactionsInRange from '../../store/hooks/useTransactions';
import TransactionsTable from '../../components/TransactionsTable';
import TransactionSummary from '../../components/TransactionSummary';
import RangeSelect from '../../components/Selector/RangeSelect';
import TransactionFilters from '../../components/Selector/TransactionFilters';
import { useTransactionFilters } from '../../store/hooks/useTransactionFilters';
import TransactionTypeDrawer from '../Layout/CustomAppBar/TransactionTypeDrawer';

export default function TransactionsList() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
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

  const [mobileTransactionMenuOpen, setMobileTransactionMenuOpen] =
    useState(false);
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
      {isMobile && (
        <Grid size={{ xs: 12 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setMobileTransactionMenuOpen(true)}
            sx={{
              width: '100%',
              py: 1,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Create Transaction
          </Button>
        </Grid>
      )}
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
      <TransactionsTable
        transactionsByDay={filteredDays}
        showHeader={!isMobile}
      />
      <Grid size={{ xs: 12 }} sx={{ mb: 10 }} />
      {isMobile && (
        <TransactionTypeDrawer
          open={mobileTransactionMenuOpen}
          onClose={() => setMobileTransactionMenuOpen(false)}
        />
      )}
    </>
  );
}

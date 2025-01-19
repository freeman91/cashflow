import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';

import TransactionListItem from '../routes/Transactions/ListItems/TransactionListItem';
import TransactionTypeSelect from './Selector/TransactionTypeSelect';
import RangeSelect from './Selector/RangeSelect';
import useTransactionsInRange from '../store/hooks/useTransactions';

export const TRANSACTION_ORDER = [
  'recurring',
  'income',
  'paycheck',
  'repayment',
  'expense',
  'transfer',
  'borrow',
  'purchase',
  'sale',
];

export default function TransactionsTable(props) {
  const { range: rangeProps, types: typesProps } = props;

  const [types, setTypes] = useState([]);
  const [range, setRange] = useState({
    id: 2,
    label: 'Custom Range',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(3, 'day'),
  });
  const days = useTransactionsInRange(types, range, true);

  useEffect(() => {
    if (rangeProps) {
      setRange(rangeProps);
    }
  }, [rangeProps]);

  useEffect(() => {
    if (typesProps) {
      setTypes(typesProps);
    }
  }, [typesProps]);

  return (
    <Grid size={{ xs: 12 }} sx={{ width: '100%', mb: 5 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <List disablePadding>
          {!rangeProps && !typesProps && (
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <RangeSelect range={range} setRange={setRange} />
              <TransactionTypeSelect types={types} setTypes={setTypes} />
            </ListItem>
          )}
          {days.map((day, idx) => {
            if (day.transactions.length === 0) return null;
            return (
              <React.Fragment key={idx}>
                <ListItem
                  key={idx}
                  sx={{
                    backgroundImage: (theme) => theme.vars.overlays[8],
                  }}
                >
                  <ListItemText
                    primary={day.date.format('MMM Do, YYYY')}
                    slotProps={{
                      primary: { fontWeight: 'bold' },
                    }}
                  />
                </ListItem>
                {day.transactions.map((transaction, idx) => {
                  return (
                    <TransactionListItem key={idx} transaction={transaction} />
                  );
                })}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Grid>
  );
}

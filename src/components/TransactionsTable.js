import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';

import TransactionListItem from '../routes/Transactions/ListItems/TransactionListItem';

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
  const { transactionsByDay } = props;

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
          {transactionsByDay.map((day, idx) => {
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

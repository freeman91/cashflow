import React from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

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
    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant='body1'
          fontWeight='bold'
          color='textSecondary'
          align='center'
          sx={{ px: 2, py: 1 }}
        >
          TRANSACTIONS
        </Typography>
        <List disablePadding>
          {transactionsByDay.map((day, idx) => {
            if (day.transactions.length === 0) return null;
            return (
              <React.Fragment key={idx}>
                <ListItem
                  key={idx}
                  sx={{
                    backgroundImage: (theme) => theme.vars.overlays[8],
                    py: 0,
                  }}
                >
                  <ListItemText
                    primary={day.date.format('MMM Do, YYYY')}
                    slotProps={{
                      primary: { fontWeight: 'bold' },
                    }}
                  />
                  <ListItemText
                    secondary={day.date.isSame(dayjs(), 'day') ? 'Today' : ''}
                    slotProps={{
                      secondary: { align: 'right' },
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

import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';

export default function ExpenseSummary(props) {
  const { principalSum, interestSum, escrowSum, otherExpenseSum } = props;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[12],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        p: 1,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 350,
      }}
    >
      <List disablePadding sx={{ width: '100%' }}>
        {principalSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Principal'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(principalSum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {interestSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Interest'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(interestSum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {escrowSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Escrow'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(escrowSum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {otherExpenseSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='All Other'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(otherExpenseSum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}

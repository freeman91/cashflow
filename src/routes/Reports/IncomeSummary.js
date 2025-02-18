import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';

export default function IncomeSummary(props) {
  const { earnedIncomes, passiveIncomes, otherIncomes } = props;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[24],
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
        {earnedIncomes.takeHomeSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Take Home'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(earnedIncomes.takeHomeSum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {earnedIncomes.employeeContributionsSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Employee Contributions'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(
                earnedIncomes.employeeContributionsSum
              )}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {earnedIncomes.employerContributionsSum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Employer Contributions'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(
                earnedIncomes.employerContributionsSum
              )}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {passiveIncomes.sum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Passive'
              slotProps={{
                secondary: { variant: 'h6' },
              }}
            />
            <ListItemText
              primary={numberToCurrency.format(passiveIncomes.sum)}
              slotProps={{
                primary: { align: 'right', variant: 'h6' },
              }}
            />
          </ListItem>
        )}
        {otherIncomes.sum > 0 && (
          <ListItem disableGutters sx={{ py: 0, gap: 1 }}>
            <ListItemText
              secondary='Other'
              slotProps={{ secondary: { variant: 'h6' } }}
            />
            <ListItemText
              primary={numberToCurrency.format(otherIncomes.sum)}
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

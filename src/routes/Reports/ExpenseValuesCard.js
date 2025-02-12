import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListIcon from '@mui/icons-material/List';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function ExpenseValuesCard(props) {
  const {
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expanded,
    setExpanded,
  } = props;
  const theme = useTheme();

  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {expanded && (
        <Box
          sx={{
            position: 'relative',
            top: 0,
            left: 0,
            height: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <IconButton
            sx={{ height: 35, width: 35 }}
            onClick={() => console.log('view expenses')}
          >
            <ListIcon />
          </IconButton>
        </Box>
      )}
      <Box
        sx={{
          position: 'relative',
          top: 0,
          right: 0,
          height: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          sx={{ height: 35, width: 35 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Typography color='textSecondary' variant='h6'>
        Expenses
      </Typography>
      <Typography
        fontWeight='bold'
        variant='h5'
        sx={{ color: theme.palette.error.main }}
      >
        {numberToCurrency.format(totalExpense)}
      </Typography>
      {expanded && (
        <List disablePadding sx={{ width: '100%' }}>
          {principalSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Principal'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(principalSum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {interestSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Interest'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(interestSum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {escrowSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Escrow'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(escrowSum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {otherExpenseSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='All Other'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(otherExpenseSum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
}

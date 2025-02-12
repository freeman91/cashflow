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

export default function IncomeValuesCard(props) {
  const { earnedIncomes, passiveIncomes, otherIncomes, expanded, setExpanded } =
    props;
  const theme = useTheme();

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
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
            onClick={() => console.log('view incomes')}
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
        Income
      </Typography>
      <Typography
        fontWeight='bold'
        variant='h5'
        sx={{ color: theme.palette.success.main }}
      >
        {numberToCurrency.format(totalIncome)}
      </Typography>

      {expanded && (
        <List disablePadding sx={{ width: '100%' }}>
          {earnedIncomes.takeHomeSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Take Home'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(earnedIncomes.takeHomeSum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {earnedIncomes.employeeContributionsSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Employee Contributions'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(
                  earnedIncomes.employeeContributionsSum
                )}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {earnedIncomes.employerContributionsSum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Employer Contributions'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(
                  earnedIncomes.employerContributionsSum
                )}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {passiveIncomes.sum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Passive'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(passiveIncomes.sum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
          {otherIncomes.sum > 0 && (
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                secondary='Other'
                slotProps={{ secondary: { variant: 'h6' } }}
              />
              <ListItemText
                primary={numberToCurrency.format(otherIncomes.sum)}
                slotProps={{ primary: { align: 'right', variant: 'h6' } }}
              />
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
}

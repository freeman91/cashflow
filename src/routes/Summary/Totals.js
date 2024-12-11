import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import SummaryListItemValue from './SummaryListItemValue';

export default function Totals(props) {
  const { incomeSum, expenseSum, principalSum, interestSum, escrowSum } = props;
  const theme = useTheme();

  const totalSpent = expenseSum + principalSum + interestSum + escrowSum;
  const net = incomeSum - totalSpent;
  const nonPrincipalSum = totalSpent - principalSum;
  const max = Math.max(incomeSum, totalSpent);
  const incomePercent = (incomeSum / max) * 100;
  const expensePercent = (totalSpent / max) * 100;

  return (
    <>
      {totalSpent > 0 && incomeSum > 0 && (
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card sx={{ width: '100%' }}>
            <SummaryListItemValue value={net} label='cashflow' />
          </Card>
        </Grid>
      )}

      {incomeSum > 0 && (
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card sx={{ width: '100%', pb: 1 }}>
            <SummaryListItemValue value={incomeSum} label='earned' />
            <ListItem>
              <Box
                sx={{
                  width: `${incomePercent}%`,
                  borderRadius: '5px',
                  backgroundColor: theme.palette.success.main,
                  height: '10px',
                }}
              />
            </ListItem>
          </Card>
        </Grid>
      )}

      {totalSpent > 0 && (
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card sx={{ width: '100%', pb: 0.5 }}>
            <SummaryListItemValue value={totalSpent} label='spent' />
            <ListItem>
              <Box
                sx={{
                  width: `${expensePercent}%`,
                  height: '10px',
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    width: `${(nonPrincipalSum / expenseSum) * 100}%`,
                    backgroundColor: theme.palette.error.main,
                    height: '10px',
                    borderRadius: '5px',
                  }}
                />
                <Box
                  sx={{
                    width: `${(principalSum / expenseSum) * 100}%`,
                    backgroundColor: theme.palette.red[200],
                    height: '10px',
                    borderRadius: '5px',
                  }}
                />
              </Box>
            </ListItem>
            <SummaryListItemValue value={expenseSum} label='expenses' />
            <SummaryListItemValue
              value={principalSum + interestSum + escrowSum}
              label='repayments'
            />
            <Divider sx={{ mx: 1 }} />
            <SummaryListItemValue
              value={principalSum}
              label='principal'
              textSize='small'
              gutters
            />
          </Card>
        </Grid>
      )}
    </>
  );
}

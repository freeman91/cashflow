import React from 'react';

import { darken, lighten, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import LabelValueBox from '../../components/LabelValueBox';

export default function Totals(props) {
  const {
    numMonths = 1,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
    incomeSum,
    paycheckSum,
  } = props;

  const theme = useTheme();

  const nonPrincipalExpenseSum = expenseSum + interestSum + escrowSum;
  const allIncomesSum = incomeSum + paycheckSum;
  const allExpensesSum = expenseSum + principalSum + interestSum + escrowSum;
  const max = Math.max(allIncomesSum, allExpensesSum);
  const incomePercent = (allIncomesSum / max) * 100;
  const expensePercent = (allExpensesSum / max) * 100;

  const netAvg = (allIncomesSum + allExpensesSum) / numMonths
  console.log('netAvg: ', netAvg);
  return (
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', px: 2, py: 1 }}>
          <LabelValueBox
            value={allIncomesSum - allExpensesSum}
            label='cashflow'
          />
        </Card>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', px: 2, py: 1 }}>
          <Box
            sx={{
              width: `${incomePercent}%`,
              borderRadius: '4px',
              backgroundImage: `linear-gradient(to bottom, ${
                theme.palette.success.main
              }, ${darken(theme.palette.success.main, 0.2)})`,
              height: '15px',
              my: 1,
            }}
          />
          <LabelValueBox value={allIncomesSum} label='earned' />
        </Card>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', px: 2, py: 1 }}>
          <Box
            sx={{
              width: `${expensePercent}%`,
              height: '15px',
              display: 'flex',
              my: 1,
            }}
          >
            <Box
              sx={{
                width: `${(nonPrincipalExpenseSum / allExpensesSum) * 100}%`,
                height: '15px',
                borderRadius: principalSum > 0 ? '4px 0 0 4px' : '4px',
                backgroundImage: `linear-gradient(to bottom, ${
                  theme.palette.error.main
                }, ${darken(theme.palette.error.main, 0.2)})`,
              }}
            />
            <Box
              sx={{
                width: `${(principalSum / allExpensesSum) * 100}%`,
                backgroundImage: `linear-gradient(to bottom, ${lighten(
                  theme.palette.error.main,
                  0.2
                )}, ${theme.palette.error.main})`,
                height: '15px',
                borderRadius: '0 4px 4px 0',
              }}
            />
          </Box>
          <LabelValueBox value={allExpensesSum} label='spent' />
        </Card>
      </Grid>
    </>
  );
}

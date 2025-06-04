import React from 'react';

import Grid from '@mui/material/Grid2';

import IncomeValuesCard from '../IncomeValuesCard';
import ExpenseValuesCard from '../ExpenseValuesCard';
import NetValuesCard from '../NetValuesCard';
import IncomeBreakdown from '../IncomeBreakdown';
import ExpenseBreakdown from '../ExpenseBreakdown';
import SankeyChart from '../SankeyChart';
import ByMonthChart from '../ByMonthChart';

export default function MonthOverview(props) {
  const {
    date,
    earnedIncomes,
    passiveIncomes,
    otherIncomes,
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expenses,
    repayments,
  } = props;

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <>
      <ByMonthChart year={date.year()} month={date.month()} />
      <Grid size={{ md: 4, xs: 6 }}>
        <IncomeValuesCard
          date={date}
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Grid>
      <Grid
        size={{ md: 4 }}
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <ExpenseValuesCard
          date={date}
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
        />
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{
          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <IncomeBreakdown
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <ExpenseBreakdown expenses={expenses} repayments={repayments} />
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{ px: 2, pb: 10, display: { xs: 'none', md: 'block' } }}
      >
        <SankeyChart
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
          expenses={expenses}
          repayments={repayments}
        />
      </Grid>
    </>
  );
}

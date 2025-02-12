import React, { useState } from 'react';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import useMonthInflows from '../../store/hooks/useMonthInflows';
import useMonthOutflows from '../../store/hooks/useMonthOutflows';
import IncomeValuesCard from './IncomeValuesCard';
import ExpenseValuesCard from './ExpenseValuesCard';
import NetValuesCard from './NetValuesCard';

export default function MonthReport(props) {
  const { date } = props;

  const [expanded, setExpanded] = useState(false);
  const { earnedIncomes, passiveIncomes, otherIncomes } = useMonthInflows(
    date.year(),
    date.month()
  );
  const { principalSum, interestSum, escrowSum, otherExpenseSum } =
    useMonthOutflows(date.year(), date.month());

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography fontWeight='bold' variant='h5'>
          {date.format('MMMM YYYY')}
        </Typography>
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <IncomeValuesCard
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <ExpenseValuesCard
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <NetValuesCard
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </Grid>
    </>
  );
}

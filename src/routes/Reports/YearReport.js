import React, { useState } from 'react';
import dayjs from 'dayjs';

import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useYearInflows from '../../store/hooks/useYearInflows';
import useYearOutflows from '../../store/hooks/useYearOutflows';
import ByMonthChart from './ByMonthChart';
import IncomeValuesCard from './IncomeValuesCard';
import ExpenseValuesCard from './ExpenseValuesCard';
import NetValuesCard from './NetValuesCard';
import IncomeBreakdown from './IncomeBreakdown';
import ExpenseBreakdown from './ExpenseBreakdown';
import SankeyChart from './SankeyChart';

export default function YearReport() {
  const [date, setDate] = useState(dayjs().month(11).date(15));
  const { earnedIncomes, passiveIncomes, otherIncomes } = useYearInflows(
    date.year()
  );

  const {
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expenses,
    repayments,
  } = useYearOutflows(date.year());

  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <>
      <ByMonthChart year={date.year()} month={date.month()} />
      <Grid size={{ xs: 12 }}>
        <DatePicker
          size='medium'
          value={date}
          onChange={(value) => {
            setDate(value.month(11).date(15));
          }}
          format='YYYY'
          views={['year']}
          slotProps={{
            textField: {
              variant: 'standard',
            },
          }}
        />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <IncomeValuesCard
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <NetValuesCard totalIncome={totalIncome} totalExpense={totalExpense} />
      </Grid>
      <Grid size={{ md: 4, xs: 6 }}>
        <ExpenseValuesCard
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
        />
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
      <Grid size={{ xs: 12 }} sx={{ px: 2, pb: 10 }}>
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

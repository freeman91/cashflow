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

export default function YearReport() {
  const [date, setDate] = useState(dayjs().month(11).date(15));
  const [expanded, setExpanded] = useState(false);
  const { earnedIncomes, passiveIncomes, otherIncomes } = useYearInflows(
    date.year()
  );

  const { principalSum, interestSum, escrowSum, otherExpenseSum } =
    useYearOutflows(date.year());

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

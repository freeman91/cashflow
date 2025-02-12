import React, { useState } from 'react';
import dayjs from 'dayjs';

import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useMonthInflows from '../../store/hooks/useMonthInflows';
import useMonthOutflows from '../../store/hooks/useMonthOutflows';
import IncomeValuesCard from './IncomeValuesCard';
import ExpenseValuesCard from './ExpenseValuesCard';
import NetValuesCard from './NetValuesCard';
import ByMonthChart from './ByMonthChart';

export default function MonthReport() {
  const [date, setDate] = useState(dayjs());
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
      <ByMonthChart year={date.year()} month={date.month()} />
      <Grid size={{ xs: 12 }}>
        <DatePicker
          size='medium'
          value={date}
          onChange={(value) => {
            setDate(value.date(15));
          }}
          format='MMMM YYYY'
          views={['month', 'year']}
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

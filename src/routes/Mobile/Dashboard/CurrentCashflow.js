import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BoxFlexCenter from '../../../components/BoxFlexCenter';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import useExpenses from '../../../store/hooks/useExpenses';
import useIncomes from '../../../store/hooks/useIncomes';

export default function CurrentCashflow() {
  const today = dayjs();
  const { sum: expenseSum } = useExpenses(today.year(), today.month());
  const { sum: incomeSum } = useIncomes(today.year(), today.month());
  const [net, setNet] = useState(0);

  useEffect(() => {
    setNet(incomeSum - expenseSum);
  }, [incomeSum, expenseSum]);

  const show = incomeSum > 0 && expenseSum > 0;
  return (
    <Grid item xs={6}>
      <Stack direction='column'>
        <Typography variant='body1' color='text.secondary' align='center'>
          cashflow
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(net)}
          </Typography>
        </BoxFlexCenter>
        {show && (
          <Typography
            variant='body1'
            color='success.main'
            fontWeight='bold'
            align='center'
          >
            +{numberToCurrency.format(incomeSum)}
          </Typography>
        )}
        {show && (
          <Typography
            variant='body1'
            color='error.main'
            fontWeight='bold'
            align='center'
          >
            -{numberToCurrency.format(expenseSum)}
          </Typography>
        )}
      </Stack>
    </Grid>
  );
}

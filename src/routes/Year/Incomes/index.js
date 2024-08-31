import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import IncomesByMonthChart from './IncomesByMonthChart';
import useIncomes from '../../../store/hooks/useIncomes';
import Incomes from '../../Dashboard/Summary/Incomes';

export default function YearIncomes(props) {
  const { year } = props;
  const { sum: incomeSum, incomes } = useIncomes(year);

  return (
    <>
      <Grid item xs={12} mx={1} pt='0 !important'>
        <BoxFlexCenter>
          <Typography variant='h4' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h4' color='white' fontWeight='bold'>
            {_numberToCurrency.format(incomeSum)}
          </Typography>
        </BoxFlexCenter>
      </Grid>
      <IncomesByMonthChart year={year} />
      <Incomes incomes={incomes} />
    </>
  );
}

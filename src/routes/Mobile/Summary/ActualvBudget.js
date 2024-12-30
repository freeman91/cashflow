import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import FullBar from '../Budgets/FullBar';
import FillBar from '../Budgets/FillBar';
import OverageBar from '../Budgets/OverageBar';

export default function ActualvBudget(props) {
  const { year, month, actual, category, color } = props;

  const allBudgets = useSelector((state) => state.budgets.data);

  const [goal, setGoal] = useState(0);

  useEffect(() => {
    let budgets = [];
    if (isNaN(month)) {
      budgets = filter(allBudgets, {
        year: Number(year),
      });
    } else {
      budgets = [
        find(allBudgets, {
          year: year,
          month: month,
        }),
      ];
    }
    const _goal = budgets.reduce((acc, budget) => {
      return (
        acc + budget?.categories?.find((c) => c.category === category)?.goal
      );
    }, 0);
    setGoal(_goal);
  }, [allBudgets, category, year, month]);

  if (goal === 0) return null;
  const diff = goal - actual;
  return (
    <>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Box
          sx={{
            width: '100%',
            px: 2,
            py: 1,
            border: (theme) => `1px solid ${theme.palette.surface[300]}`,
            borderRadius: 1,
          }}
        >
          <BoxFlexCenter
            sx={{ alignItems: 'flex-end' }}
            justifyContent='space-between'
          >
            <Typography variant='h6' align='left' sx={{ width: '33%' }}>
              budget
            </Typography>
            <Typography
              variant='body1'
              color={diff >= 0 ? 'success.main' : 'error.main'}
              fontWeight='bold'
              align='center'
              sx={{ width: '33%' }}
            >
              {numberToCurrency.format(diff)}
            </Typography>
            <BoxFlexCenter sx={{ width: '33%' }}>
              <Typography variant='h6' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' color='white' fontWeight='bold'>
                {_numberToCurrency.format(goal)}
              </Typography>
            </BoxFlexCenter>
          </BoxFlexCenter>
          <FullBar>
            <FillBar fillValue={actual} goalSum={goal} color={color} />
            <OverageBar expenseSum={actual} goal={goal} />
          </FullBar>
        </Box>
      </Grid>
    </>
  );
}

import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import FillBar from './FillBar';
import FullBar from './FullBar';
import OverageBar from './OverageBar';
export default function CategorySummary({ category, updateGoal, budget }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = Number(e.target.value).toFixed(0);
    updateGoal(category.category, value);
  };

  const handleClick = () => {
    dispatch(push(`/budgets/${category.category}`));
  };

  const diff = category.goal - category.expenseSum;
  const fillValue = diff < 0 ? category.goal : category.expenseSum;
  return (
    <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
      <Card sx={{ width: '100%', px: 2, py: 1 }}>
        <BoxFlexCenter
          justifyContent='space-between'
          sx={{ alignItems: 'center ' }}
        >
          <Typography
            variant='h6'
            fontWeight='bold'
            align='center'
            color='text.secondary'
          >
            {category.category}
          </Typography>
          <IconButton sx={{ color: 'button' }} onClick={handleClick}>
            <ChevronRightIcon />
          </IconButton>
        </BoxFlexCenter>
        <Grid container>
          <Grid item xs={4}>
            <BoxFlexCenter justifyContent='flex-start'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(category.expenseSum)}
              </Typography>
            </BoxFlexCenter>
          </Grid>
          <Grid
            item
            xs={4}
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            <Typography
              variant='body1'
              color={diff >= 0 ? 'success.main' : 'error.main'}
              fontWeight='bold'
              align='center'
            >
              {numberToCurrency.format(diff)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <BoxFlexCenter justifyContent='flex-end'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <TextField
                variant='standard'
                inputProps={{ style: { textAlign: 'right' } }}
                value={category.goal}
                onChange={handleChange}
                sx={{ width: 75 }}
              />
            </BoxFlexCenter>
          </Grid>
        </Grid>
        <FullBar>
          <FillBar
            fillValue={fillValue}
            goalSum={category.goal}
            color={category.color}
          />
          <OverageBar expenseSum={category.expenseSum} goal={category.goal} />
        </FullBar>
      </Card>
    </Grid>
  );
}

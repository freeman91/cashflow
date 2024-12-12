import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';

import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { putBudget } from '../../../store/budgets';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import { _numberToCurrency, numberToCurrency } from '../../../helpers/currency';
import FullBar from '../FullBar';
import FillBar from '../FillBar';
import OverageBar from '../OverageBar';

export default function MonthCategory(props) {
  const { category, date, goal, expenseSum, barMax, color } = props;
  const dispatch = useDispatch();
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const budgets = useSelector((state) => state.budgets.data);
  const [showSave, setShowSave] = useState(false);
  const [goalState, setGoalState] = useState(goal);

  const handleChange = (e) => {
    setShowSave(true);
    const value = Number(e.target.value).toFixed(0);
    setGoalState(value);
  };

  const handleSave = () => {
    let _budget = find(budgets, (budget) => {
      return dayjs(budget.date).isSame(date, 'month');
    });

    if (_budget) {
      _budget = cloneDeep(_budget);
      _budget.categories = _budget.categories.map((_category) => {
        if (_category.category === category) {
          return { ..._category, goal: Number(goalState) };
        }
        return _category;
      });
    } else {
      _budget = {
        year: date.year(),
        month: date.month() + 1,
        date: date.set('date', 15),
        categories: [],
      };
      _budget.categories = expenseCategories?.categories.map((_category) => {
        return {
          category: _category.name,
          color: _category.color,
          goal: category === _category.name ? Number(goalState) : 100,
        };
      });
    }
    dispatch(putBudget(_budget));
    setShowSave(false);
  };

  const diff = (goalState || 0) - expenseSum;
  const fillValue = diff < 0 ? goalState : expenseSum;
  return (
    <Grid item xs={12} key={date} mx={1}>
      <Card sx={{ width: '100%', p: 1 }}>
        <BoxFlexCenter justifyContent='space-between'>
          <Typography
            variant='h6'
            fontWeight='bold'
            align='left'
            color='text.secondary'
          >
            {date.format('MMMM YYYY')}
          </Typography>
          <IconButton
            sx={{
              color: 'button',
              visibility: showSave ? 'visible' : 'hidden',
            }}
            onClick={handleSave}
          >
            <SaveIcon />
          </IconButton>
        </BoxFlexCenter>

        <Grid container>
          <Grid item xs={4}>
            <BoxFlexCenter justifyContent='flex-start'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(expenseSum)}
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
                value={goalState || 0}
                onChange={handleChange}
                sx={{ width: 75 }}
              />
            </BoxFlexCenter>
          </Grid>
        </Grid>
        <FullBar>
          <FillBar
            fillValue={fillValue}
            goalSum={goalState}
            color={color}
            barMax={barMax}
          />
          <OverageBar
            expenseSum={expenseSum}
            goal={goalState}
            barMax={barMax}
          />
        </FullBar>
      </Card>
    </Grid>
  );
}

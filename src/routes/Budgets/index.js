import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../store/user';
import { putBudget } from '../../store/budgets';
import CustomAppBar from '../../components/CustomAppBar';
import PullToRefresh from '../../components/PullToRefresh';
import MonthSelectButton from '../../components/MonthSelectButton';
import OverallSummary from './OverallSummary';
import SaveButton from '../../components/CustomAppBar/SaveButton';

const defaultBudget = {
  _type: 'budget',
  date: '',
  year: 0,
  month: 0,
  categories: [],
};

export default function Budgets() {
  const dispatch = useDispatch();
  const today = dayjs().set('date', 15);

  const budgets = useSelector((state) => state.budgets.data);
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [showSave, setShowSave] = useState(false);
  const [date, setDate] = useState(today);
  const [currentBudget, setCurrentBudget] = useState(defaultBudget);
  const [budgetCategories, setBudgetCategories] = useState([]);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (!date) return;
    let _budget = budgets.find((budget) => {
      return dayjs(budget.date).isSame(date, 'month');
    });

    if (!_budget) {
      const lastMonth = date.subtract(1, 'month');
      _budget = budgets.find((budget) => {
        return dayjs(budget.date).isSame(lastMonth, 'month');
      });
      if (_budget) {
        _budget = {
          date: date.set('date', 15),
          year: date.year(),
          month: date.month() + 1,
          categories: _budget.categories,
        };
      }
    }

    if (!expenseCategories) return;
    if (!_budget) {
      _budget = {
        ...defaultBudget,
        year: date.year(),
        month: date.month() + 1,
        date: date.set('date', 15),
        categories: [],
      };
      _budget.categories = expenseCategories?.categories.map((category) => {
        return {
          category: category.name,
          goal: 100,
        };
      });
    }
    setCurrentBudget(_budget);
  }, [budgets, date, expenseCategories]);

  const handlePrevMonth = () => {
    const previousMonth = date?.subtract(1, 'month');
    setDate(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = date?.add(1, 'month');
    setDate(nextMonth);
  };

  const handleSave = () => {
    let _budget = {
      ...currentBudget,
      categories: budgetCategories.map((category) => {
        return {
          category: category.category,
          color: category.color,
          goal: Number(category.goal),
        };
      }),
    };

    dispatch(putBudget(_budget));
    setShowSave(false);
  };

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            budgets
          </Typography>
        }
        right={<SaveButton onClick={handleSave} show={showSave} />}
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              py: 1,
            }}
          >
            <MonthSelectButton
              Icon={ChevronLeftIcon}
              onClick={handlePrevMonth}
            />
            <Typography variant='h5' fontWeight='bold'>
              {date?.format('MMMM YYYY')}
            </Typography>
            <MonthSelectButton
              Icon={ChevronRightIcon}
              onClick={handleNextMonth}
            />
          </Box>
        </Grid>
        <OverallSummary
          setShowSave={setShowSave}
          budget={currentBudget}
          budgetCategories={budgetCategories}
          setBudgetCategories={setBudgetCategories}
        />
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}

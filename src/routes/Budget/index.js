import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { Grid } from '@mui/material';

import { getGoals } from '../../store/goals';

import GoalCharts from '../../components/charts/GoalCharts';
import GoalForm from '../../components/Form/GoalForm';

export default function Budget() {
  const dispatch = useDispatch();

  useMount(() => {
    dispatch(getGoals());
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={6} spacing={3}>
          <GoalCharts />
        </Grid>
        <Grid container item xs={6} spacing={3}>
          <GoalForm />
        </Grid>
      </Grid>
    </>
  );
}

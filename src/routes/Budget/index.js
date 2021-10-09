import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { makeStyles } from '@mui/styles';
import { Grid, Paper, Typography } from '@mui/material';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
    },
  };
});

export default function Budget() {
  const classes = useStyles();
  // const { data: goals } = useSelector((state) => state.goals);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='center' variant='h4'>
                {dayjs().format('MMMM YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                List Goals and actual
                <br />
                Show Total at the end
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='center' variant='h4'>
                {dayjs().add(1, 'month').format('MMMM YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                List Goals and allow edit
                <br />
                Show Total at the end
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='center' variant='h4'>
                Select Month
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                List Goals and actual if in the past
                <br />
                List Goals and edit if in the future
                <br />
                Show Total at the end
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

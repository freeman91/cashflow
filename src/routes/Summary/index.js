import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';

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

export default function Summary() {
  const classes = useStyles();
  // const { data: goals } = useSelector((state) => state.goals);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ width: '100%' }} align='middle' variant='h4'>
                Date Range Selector and submit button
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '35vh' }} align='left' variant='h4'>
                Filters
                <br />
                record
                <br />
                category
                <br />
                record
                <br />
                type
                <br />
                *income source
                <br />
                *expense vendor
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '25vh' }} align='middle' variant='h4'>
                Totals
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '80vh' }} align='left' variant='h4'>
                Table of records
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '35vh' }} align='left' variant='h4'>
                Chart 1
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '35vh' }} align='left' variant='h4'>
                Chart 2
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

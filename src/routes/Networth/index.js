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

export default function Networth() {
  const classes = useStyles();
  // const { data: goals } = useSelector((state) => state.goals);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '65vh' }} align='left' variant='h4'>
                Current Assets
                <br />
                Current Debts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '40vh' }} align='middle' variant='h4'>
                Net Worth over time
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '80vh' }} align='left' variant='h4'>
                Month Select
                <br />
                List Assets
                <br />
                List Debts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

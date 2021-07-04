import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';

import Table from '../../components/Table';
import { numberToCurrency } from '../../helpers/currency';

const useStyles = makeStyles((theme) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    toolbar: {
      backgroundColor: '#616161',
      minHeight: `50px`,
      textAlign: 'left',
    },
    header: {
      flex: 1,
    },
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
  const user = useSelector((state) => state.user);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Card className={classes.container}>
              <Toolbar className={classes.toolbar}>
                <Typography
                  variant='h6'
                  color='inherit'
                  className={classes.header}
                >
                  Basic Info
                </Typography>
              </Toolbar>
              <CardContent>
                <TextField
                  disabled
                  fullWidth
                  id='name-input'
                  label='name'
                  name='name'
                  value={user.name}
                  variant='outlined'
                  margin='dense'
                />
                <TextField
                  disabled
                  fullWidth
                  id='email-input'
                  label='email'
                  email='email'
                  value={user.email}
                  variant='outlined'
                  margin='dense'
                />
                <TextField
                  disabled
                  fullWidth
                  id='networth-input'
                  label='networth'
                  networth='networth'
                  value={numberToCurrency.format(user.networth)}
                  variant='outlined'
                  margin='dense'
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Table
              data={user.income.types.map((type) => {
                return {
                  name: type,
                };
              })}
              title='Income Types'
              handleClick={(type) => console.log('type: ', type)}
              attrs={['name']}
            />
          </Grid>
          <Grid item xs={6}>
            <Table
              data={user.income.sources.map((source) => {
                return {
                  name: source,
                };
              })}
              title='Income Sources'
              handleClick={(source) => console.log('source: ', source)}
              attrs={['name']}
            />
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={6}>
            <Table
              data={user.expense.types.map((type) => {
                return {
                  name: type,
                };
              })}
              title='Expense Types'
              handleClick={(type) => console.log('type: ', type)}
              attrs={['name']}
            />
          </Grid>
          <Grid item xs={6}>
            <Table
              data={user.expense.vendors.map((vendor) => {
                return {
                  name: vendor,
                };
              })}
              title='Expense Vendors'
              handleClick={(vendor) => console.log('vendor: ', vendor)}
              attrs={['name']}
            />
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={6}>
            <Table
              data={user.asset.types.map((type) => {
                return {
                  name: type,
                };
              })}
              title='Asset Types'
              handleClick={(type) => console.log('type: ', type)}
              attrs={['name']}
            />
          </Grid>
          <Grid item xs={6}>
            <Table
              data={user.debt.types.map((type) => {
                return {
                  name: type,
                };
              })}
              title='Debt Types'
              handleClick={(type) => console.log('type: ', type)}
              attrs={['name']}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

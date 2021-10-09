import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';

import { numberToCurrency } from '../../helpers/currency';

export default function Networth() {
  const user = useSelector((state) => state.user);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Card>
            <Typography
              variant='h6'
              align='left'
              sx={{
                pt: 2,
                pl: 2,
              }}
            >
              User
            </Typography>
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
      </Grid>
    </>
  );
}

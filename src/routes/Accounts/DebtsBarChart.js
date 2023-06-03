import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/styles';
import { Box, Grid, Typography } from '@mui/material';
import { filter, get, map, reduce, sortBy } from 'lodash';

import { numberToCurrency } from '../../helpers/currency';

export default function DebtsBarChart() {
  const theme = useTheme();
  const storeDebts = useSelector((state) => state.debts.data);

  const [debts, setDebts] = useState([]);

  // sort debts
  useEffect(() => {
    let data = [];
    let _debts = sortBy(
      filter(storeDebts, (debt) => debt.value !== 0),
      'value'
    ).reverse();

    for (let i = 0; i < 5; i++) {
      const debt = _debts.shift();
      if (debt) data.push(debt);
    }

    const otherDebtsValue = reduce(
      _debts,
      (acc, debt) => acc + get(debt, 'value', 0),
      0
    );

    if (otherDebtsValue) {
      data.push({ name: 'Other', value: otherDebtsValue, id: 'other-debts' });
    }

    setDebts(data);
  }, [storeDebts]);

  const debtMax = get(debts, '0.value', 1000);

  return (
    <Grid
      item
      xs={6}
      container
      justifyContent='center'
      display='flex'
      height={300}
      sx={{ paddingTop: '0 !important' }}
    >
      {map(debts, (debt) => {
        return (
          <React.Fragment key={debt.id}>
            <Grid item xs={5}>
              <Typography align='left'>{debt.name}</Typography>
            </Grid>

            <Grid item xs={7}>
              <Box
                sx={{
                  backgroundColor: theme.palette.blue[600],
                  width: `${(debt.value / debtMax) * 100}%`,
                  borderRadius: '3px',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography ml={2}>
                  {numberToCurrency.format(debt.value)}
                </Typography>
              </Box>
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
}

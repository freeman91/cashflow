import React from 'react';
import { get, map } from 'lodash';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../../helpers/currency';

export default function IncomesByType(props) {
  const { incomes, incomeTotal } = props;
  const theme = useTheme();

  const incMax = get(incomes, '0.sum', 1000);

  return (
    <Card raised>
      <CardHeader
        title={
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5'>Incomes</Typography>
            <Typography variant='h6' color='text.secondary'>
              {numberToCurrency.format(incomeTotal)}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ pt: 0, paddingBottom: '8px !important' }}>
        <Grid
          container
          sx={{ paddingTop: '0 !important' }}
          alignItems='center'
          spacing={1}
        >
          {map(incomes, (income) => {
            return (
              <React.Fragment key={income.type}>
                <Grid item xs={4}>
                  <Typography align='left'>{income.type}</Typography>
                </Grid>

                <Grid item xs={8} sx={{ pt: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: theme.palette.green[600],
                      width: `${(income.sum / incMax) * 100}%`,
                      borderRadius: '5px',
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Typography ml={2}>
                      {numberToCurrency.format(income.sum)}
                    </Typography>
                  </Box>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}

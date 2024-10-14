import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';

export default function CashflowContainer(props) {
  const { incomeSum, expenseSum, principalSum } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const net = incomeSum - expenseSum;
  const nonPrincipalSum = expenseSum - principalSum;
  const max = Math.max(incomeSum, expenseSum, 8000);
  const incomePercent = (incomeSum / max) * 100;
  const expensePercent = (expenseSum / max) * 100;
  const maxWidth = isMobile ? '400px' : '350px';
  return (
    <Grid
      item
      xs={12}
      md={6}
      mx={1}
      pt={'0px !important'}
      mb={-1}
      sx={{ maxWidth: `${maxWidth} !important` }}
    >
      <Card
        raised
        sx={{
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 1,
          py: 1,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='body1' color='text.secondary'>
            cashflow
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
              {_numberToCurrency.format(net)}
            </Typography>
          </BoxFlexCenter>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', mr: 2 }}>
            <Typography
              variant='body1'
              color='text.secondary'
              fontWeight='bold'
            >
              earned
            </Typography>
            <Box
              sx={{
                width: `${incomePercent}%`,
                borderRadius: '5px',
                backgroundColor: theme.palette.green[400],
                height: '10px',
              }}
            />
          </Box>
          <BoxFlexCenter sx={{ pt: 2 }}>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
              {_numberToCurrency.format(incomeSum)}
            </Typography>
          </BoxFlexCenter>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', mr: 2 }}>
            <Typography
              variant='body1'
              color='text.secondary'
              fontWeight='bold'
            >
              spent
            </Typography>
            <Box
              sx={{
                width: `${expensePercent}%`,
                height: '10px',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  width: `${(nonPrincipalSum / expenseSum) * 100}%`,
                  backgroundColor: theme.palette.red[600],
                  height: '10px',
                  borderTopLeftRadius: '5px',
                  borderBottomLeftRadius: '5px',
                  borderTopRightRadius: principalSum === 0 ? '5px' : '0px',
                  borderBottomRightRadius: principalSum === 0 ? '5px' : '0px',
                }}
              />
              <Box
                sx={{
                  width: `${(principalSum / expenseSum) * 100}%`,
                  backgroundColor: theme.palette.red[400],
                  height: '10px',
                  borderTopRightRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              />
            </Box>
          </Box>
          <BoxFlexCenter sx={{ pt: 2 }}>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' color='white' fontWeight='bold'>
              {_numberToCurrency.format(expenseSum)}
            </Typography>
          </BoxFlexCenter>
        </Box>
      </Card>
    </Grid>
  );
}

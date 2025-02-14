import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function NetValuesCard(props) {
  const { totalIncome, totalExpense } = props;
  const theme = useTheme();

  const net = totalIncome - totalExpense;
  const netPercent = net / totalIncome;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography color='textSecondary' variant='h6'>
        {'Net' + (net >= 0 ? ' Gains' : ' Losses')}
      </Typography>
      <Typography
        fontWeight='bold'
        variant='h5'
        sx={{ color: theme.palette.primary.main }}
      >
        {numberToCurrency.format(net) +
          ' (' +
          Math.round(netPercent * 1000) / 10 +
          '%)'}
      </Typography>
    </Box>
  );
}

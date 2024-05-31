import React from 'react';

import { useTheme } from '@emotion/react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../helpers/currency';

export default function NetworthSummaryStack(props) {
  const { assetSum, debtSum } = props;
  const theme = useTheme();

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      sx={{ alignItems: 'center' }}
    >
      <List disablePadding sx={{ width: '45%' }}>
        <ListItem disableGutters disablePadding>
          <ListItemText sx={{ width: '20%' }} secondary='assets' />
          <ListItemText primary={numberToCurrency.format(assetSum)} />
        </ListItem>
        <ListItem disableGutters disablePadding>
          <ListItemText sx={{ width: '20%' }} secondary='debts' />
          <ListItemText primary={'-' + numberToCurrency.format(debtSum)} />
        </ListItem>
      </List>
      <Typography
        variant='h4'
        color={
          assetSum > debtSum ? theme.palette.green[600] : theme.palette.red[600]
        }
      >
        {numberToCurrency.format(assetSum - debtSum)}
      </Typography>
    </Stack>
  );
}

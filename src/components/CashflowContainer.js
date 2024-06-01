import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../helpers/currency';
dayjs.extend(advancedFormat);
const BORDER_RADIUS = '2px';

export default function CashflowContainer(props) {
  const { incomeSum, expenseSum, principalSum } = props;
  const theme = useTheme();

  const [upperBound, setUpperBound] = useState(100);

  useEffect(() => {
    let maxValue = Math.max(incomeSum, expenseSum + principalSum);
    setUpperBound(Math.ceil(maxValue / 100) * 100);
  }, [incomeSum, expenseSum, principalSum]);

  return (
    <CardContent sx={{ p: 1, pt: 0, pb: '8px !important' }}>
      <Stack
        direction='row'
        justifyContent='space-between'
        sx={{ alignItems: 'center' }}
      >
        <List disablePadding sx={{ width: '50%' }}>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='earned' />
            <ListItemText primary={numberToCurrency.format(incomeSum)} />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <Box
              sx={{
                backgroundColor: theme.palette.green[600],
                height: 10,
                width: `${(incomeSum / upperBound) * 100}%`,
                borderRadius: BORDER_RADIUS,
              }}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <ListItemText sx={{ width: '30%' }} secondary='spent' />
            <ListItemText
              primary={'-' + numberToCurrency.format(expenseSum + principalSum)}
            />
          </ListItem>
          <ListItem disableGutters disablePadding>
            <Tooltip
              title={
                <ListItem disablePadding disableGutters>
                  <ListItemText
                    primary='expenses'
                    primaryTypographyProps={{ variant: 'body2' }}
                    sx={{ m: 0, mr: 1, p: 0 }}
                  />
                  <ListItemText
                    sx={{ p: 0, m: 0 }}
                    primary={'-' + numberToCurrency.format(expenseSum)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      align: 'right',
                      fontWeight: 800,
                    }}
                  />
                </ListItem>
              }
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.red[600],
                  height: 10,
                  width: `${(expenseSum / upperBound) * 100}%`,
                  borderBottomLeftRadius: BORDER_RADIUS,
                  borderTopLeftRadius: BORDER_RADIUS,
                }}
              />
            </Tooltip>
            <Tooltip
              title={
                <ListItem disablePadding disableGutters>
                  <ListItemText
                    primary='principal'
                    primaryTypographyProps={{ variant: 'body2' }}
                    sx={{ m: 0, mr: 1, p: 0 }}
                  />
                  <ListItemText
                    sx={{ p: 0, m: 0 }}
                    primary={'-' + numberToCurrency.format(principalSum)}
                    primaryTypographyProps={{
                      variant: 'body2',
                      align: 'right',
                      fontWeight: 800,
                    }}
                  />
                </ListItem>
              }
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.red[400],
                  height: 10,
                  width: `${(principalSum / upperBound) * 100}%`,
                  borderBottomRightRadius: BORDER_RADIUS,
                  borderTopRightRadius: BORDER_RADIUS,
                }}
              />
            </Tooltip>
          </ListItem>
        </List>
        <Typography
          variant='h4'
          color={
            incomeSum > expenseSum + principalSum
              ? theme.palette.green[600]
              : theme.palette.red[600]
          }
        >
          {numberToCurrency.format(incomeSum - expenseSum - principalSum)}
        </Typography>
      </Stack>
    </CardContent>
  );
}

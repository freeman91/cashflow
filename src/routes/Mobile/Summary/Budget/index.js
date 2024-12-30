import React from 'react';

import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import {
  _numberToCurrency,
  numberToCurrency,
} from '../../../../helpers/currency';
import BoxFlexCenter from '../../../../components/BoxFlexCenter';
import FullBar from '../../Budgets/FullBar';

export default function YearOverallActualvBudget(props) {
  const { categoryGoals, goalSum, actualSum } = props;

  if (goalSum === 0) return null;
  const diff = goalSum - actualSum;
  const maxValue = Math.max(goalSum, actualSum);
  return (
    <>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Box
          sx={{
            width: '100%',
            px: 2,
            py: 1,
            border: (theme) => `1px solid ${theme.palette.surface[300]}`,
            borderRadius: 1,
          }}
        >
          <BoxFlexCenter
            sx={{ alignItems: 'flex-end' }}
            justifyContent='space-between'
          >
            <Typography variant='h6' align='left' sx={{ width: '33%' }}>
              budget
            </Typography>
            <Typography
              variant='body1'
              color={diff >= 0 ? 'success.main' : 'error.main'}
              fontWeight='bold'
              align='center'
              sx={{ width: '33%' }}
            >
              {numberToCurrency.format(diff)}
            </Typography>
            <BoxFlexCenter sx={{ width: '33%' }}>
              <Typography variant='h6' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' color='white' fontWeight='bold'>
                {_numberToCurrency.format(goalSum)}
              </Typography>
            </BoxFlexCenter>
          </BoxFlexCenter>
          <FullBar>
            {categoryGoals.map((category) => (
              <Tooltip
                key={category.category}
                title={
                  <ListItemText
                    primary={category.category}
                    primaryTypographyProps={{
                      align: 'center',
                      variant: 'body1',
                    }}
                    secondary={numberToCurrency.format(category.actual)}
                    secondaryTypographyProps={{
                      align: 'center',
                      variant: 'body1',
                    }}
                  />
                }
              >
                <Box
                  sx={{
                    width: `${(category.actual / maxValue) * 100}%`,
                    height: '100%',
                    backgroundImage: `linear-gradient(to bottom, ${
                      category.color
                    }, ${darken(category.color, 0.4)})`,
                  }}
                />
              </Tooltip>
            ))}
          </FullBar>
        </Box>
      </Grid>
    </>
  );
}

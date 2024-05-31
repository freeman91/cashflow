import React from 'react';

import { useTheme } from '@emotion/react';
import LaunchIcon from '@mui/icons-material/Launch';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function AccountSummary(props) {
  const { account, assetSum, debtSum } = props;
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Card raised>
        <CardHeader
          disableTypography
          title={
            <Stack
              direction='row'
              justifyContent='space-between'
              sx={{ alignItems: 'center' }}
            >
              <Typography variant='h6' align='left' fontWeight='bold'>
                {account.name}
              </Typography>
              <Typography
                variant='h5'
                align='right'
                color={
                  assetSum > debtSum
                    ? theme.palette.green[600]
                    : theme.palette.red[600]
                }
              >
                {numberToCurrency.format(assetSum - debtSum)}
              </Typography>
              <IconButton
                size='small'
                color='primary'
                onClick={() => window.open(account?.url, '_blank')}
                sx={{ mr: 1 }}
              >
                <LaunchIcon sx={{ height: 20, width: 20 }} />
              </IconButton>
            </Stack>
          }
          sx={{ p: 1, pt: '4px', pb: '4px' }}
        />
      </Card>
    </Grid>
  );
}
